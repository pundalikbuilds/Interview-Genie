"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { Bot, Mic, PhoneOff } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createVideoStreamClient,
  type VideoStreamClient,
} from "@/services/video_ws";

import { useInterviewAudio } from "@/hooks/useInterviewAudio";

import {
  TranscriptPanel,
  type TranscriptEntry,
} from "@/components/interview-room/TranscriptPanel";

import { AiAvatar } from "@/components/interview-room/AiAvatar";
import { CameraFeed } from "@/components/interview-room/CameraFeed";
import { EvaluatingLoader } from "@/components/interview-room/EvaluatingLoader";


/**
 * Pick laptop built-in camera
 */
async function getBuiltinCameraId(): Promise<string | undefined> {

  try {

    const devices =
      await navigator.mediaDevices.enumerateDevices();


    const cameras =
      devices.filter(
        (device)=>device.kind==="videoinput"
      );


    const externalKeywords = [
      "iphone",
      "ipad",
      "android",
      "phone",
      "continuity",
      "obs",
      "virtual",
      "capture",
      "droidcam",
      "epoccam",
    ];


    const builtIn =
      cameras.find((camera)=>{

        const label =
          camera.label.toLowerCase();


        return !externalKeywords.some(
          keyword=>label.includes(keyword)
        );

      });


    return builtIn?.deviceId ?? cameras[0]?.deviceId;


  } catch {

    return undefined;

  }
}



// Prevent React StrictMode duplicate audio start
let _audioFlowStarted = false;



export default function InterviewRoom(){


  const router = useRouter();



  const [
    transcript,
    setTranscript
  ] = useState<TranscriptEntry[]>([]);



  const [
    isStartingInterview,
    setIsStartingInterview
  ] = useState(true);



  const [
    cameraError,
    setCameraError
  ] = useState<string | null>(null);



  const [
    emotion,
    setEmotion
  ] = useState("");



  const [
    confidence,
    setConfidence
  ] = useState(0);



  const [
    predictionError,
    setPredictionError
  ] = useState<string | null>(null);



  const [
    audioError,
    setAudioError
  ] = useState<string | null>(null);



  const [
    isClientMounted,
    setIsClientMounted
  ] = useState(false);



  const [
    isSwapped,
    setIsSwapped
  ] = useState(false);



  const [
    elapsedSeconds,
    setElapsedSeconds
  ] = useState(0);



  const [
    isEndingCall,
    setIsEndingCall
  ] = useState(false);



  const [
    interviewSessionId
  ] = useState<string | null>(()=>{

    if(typeof window==="undefined")
      return null;


    return sessionStorage.getItem(
      "interviewSessionId"
    );

  });



  const videoRef =
    useRef<HTMLVideoElement|null>(null);



  const streamRef =
    useRef<MediaStream|null>(null);



  const videoStreamRef =
    useRef<VideoStreamClient|null>(null);



  const transcriptEndRef =
    useRef<HTMLDivElement|null>(null);



  const addAiBubble =
    (text:string)=>{

      setTranscript(prev=>[
        ...prev,
        {
          id:crypto.randomUUID(),
          role:"ai",
          text,
        }
      ]);

    };



  const handleTranscript =
    useCallback((text:string)=>{

      setTranscript(prev=>[
        ...prev,
        {
          id:crypto.randomUUID(),
          role:"user",
          text,
        }
      ]);

    },[]);



  const handleAudioError =
    useCallback((msg:string)=>{

      setAudioError(msg);

    },[]);



  const {
    isAiSpeaking,
    isRecording,
    isTranscribing,
    startQuestion,
  } =
  useInterviewAudio({

    onTranscript:
      handleTranscript,


    onError:
      handleAudioError,


    onQuestion:
      (question)=>{

        addAiBubble(question);

      },


    sessionId:
      interviewSessionId ?? undefined,

  });



  const startQuestionRef =
    useRef(startQuestion);



  useEffect(()=>{

    startQuestionRef.current =
      startQuestion;

  },[startQuestion]);



  const formatTime =
    (seconds:number)=>{

      const minutes =
        Math.floor(seconds/60)
        .toString()
        .padStart(2,"0");


      const sec =
        (seconds%60)
        .toString()
        .padStart(2,"0");


      return `${minutes}:${sec}`;

    };

  // ─────────────────────────────────────────────
  // Timer
  // ─────────────────────────────────────────────

  useEffect(()=>{

    if(isEndingCall)
      return;


    const interval =
      window.setInterval(()=>{

        setElapsedSeconds(
          previous=>previous+1
        );

      },1000);



    return ()=>{

      window.clearInterval(interval);

    };


  },[isEndingCall]);





  // ─────────────────────────────────────────────
  // Video message handler
  // ─────────────────────────────────────────────

  const handleVideoMessage =
    async(message:{
      emotion?:string;
      confidence?:number;
    })=>{


      setIsStartingInterview(false);


      if(typeof message.emotion==="string"){

        setEmotion(
          message.emotion
        );

      }


      if(typeof message.confidence==="number"){

        setConfidence(
          message.confidence
        );

      }

    };





  // ─────────────────────────────────────────────
  // Capture frame and send
  // ─────────────────────────────────────────────

  const captureAndSendFrame =
    async(client:VideoStreamClient)=>{


      const video =
        videoRef.current;


      if(
        !video ||
        !client.isConnected()
      )
        return;


      if(
        video.videoWidth===0 ||
        video.videoHeight===0
      )
        return;



      const canvas =
        document.createElement("canvas");


      canvas.width =
        video.videoWidth;


      canvas.height =
        video.videoHeight;



      const ctx =
        canvas.getContext("2d");


      if(!ctx)
        return;



      ctx.drawImage(
        video,
        0,
        0
      );



      const base64 =
        canvas
        .toDataURL(
          "image/jpeg",
          0.85
        )
        .split(",")[1];



      if(!base64)
        return;



      try{


        await client.sendFrame(base64);


        if(predictionError){

          setPredictionError(null);

        }


      }catch(error){


        const message =
          error instanceof Error
          ? error.message
          : "Video websocket failed";


        setPredictionError(message);


      }

    };





  // ─────────────────────────────────────────────
  // Camera + Video websocket
  // ─────────────────────────────────────────────

  useEffect(()=>{


    if(
      !interviewSessionId ||
      isEndingCall
    ){

      if(!interviewSessionId)
        setIsStartingInterview(false);


      return;

    }



    let mounted=true;

    let interval:number|null=null;

    let cleaned=false;



    const client =
      createVideoStreamClient({

        sessionId:
          interviewSessionId,


        onOpen:()=>{

          setPredictionError(null);

        },


        onMessage:
          handleVideoMessage,


        onError:(error)=>{


          if(cleaned)
            return;


          setIsStartingInterview(false);



          setPredictionError(
            error instanceof Error
            ? error.message
            : "Video websocket error"
          );


        },


        onClose:()=>{


          if(!cleaned)
            setIsStartingInterview(false);


        },

      });



    videoStreamRef.current =
      client;





    const startCamera =
      async()=>{


        try{


          const deviceId =
            await getBuiltinCameraId();



          const videoConstraint =
            deviceId
            ?
            {
              deviceId:{
                exact:deviceId
              },

              width:{
                ideal:1280
              },

              height:{
                ideal:720
              },

            }
            :
            {
              width:{
                ideal:1280
              },

              height:{
                ideal:720
              },

            };





          let stream:MediaStream;



          try{


            stream =
              await navigator.mediaDevices
              .getUserMedia({

                video:
                  videoConstraint,

                audio:true,

              });


          }catch{


            stream =
              await navigator.mediaDevices
              .getUserMedia({

                video:true,

                audio:true,

              });


          }





          if(!mounted){

            stream
            .getTracks()
            .forEach(
              track=>track.stop()
            );

            return;

          }





          streamRef.current =
            stream;



          if(videoRef.current){

            videoRef.current.srcObject =
              stream;


            await videoRef.current
              .play()
              .catch(()=>undefined);

          }





          await new Promise<void>(
            resolve=>{


              if(client.isConnected()){

                resolve();

                return;

              }



              const poll =
                window.setInterval(()=>{


                  if(client.isConnected()){

                    window.clearInterval(
                      poll
                    );

                    resolve();

                  }


                },100);


            }
          );





          interval =
            window.setInterval(()=>{


              void captureAndSendFrame(
                client
              );


            },2000);





        }catch(error){


          if(cleaned)
            return;



          const err =
            error as DOMException;



          let message =
            "Camera unavailable";



          if(err.name==="NotAllowedError")
            message =
              "Camera permission denied";


          if(err.name==="NotFoundError")
            message =
              "No camera found";


          if(err.name==="NotReadableError")
            message =
              "Camera already in use";



          setCameraError(message);


        }

      };





    startCamera();





    return()=>{


      mounted=false;

      cleaned=true;



      if(interval){

        window.clearInterval(interval);

      }



      if(streamRef.current){


        streamRef.current
        .getTracks()
        .forEach(
          track=>track.stop()
        );


        streamRef.current=null;

      }




      client.close();


      videoStreamRef.current=null;


    };



  },[
    interviewSessionId,
    isEndingCall
  ]);






  // ─────────────────────────────────────────────
  // Start first AI question
  // ─────────────────────────────────────────────

  useEffect(()=>{


    if(!interviewSessionId)
      return;



    if(_audioFlowStarted)
      return;



    _audioFlowStarted=true;




    let firstQuestion =
      "Hello! I'm your AI Interviewer. Let's begin — please introduce yourself.";




    try{


      const raw =
        sessionStorage.getItem(
          "interviewQuestions"
        );



      if(raw){


        const questions =
          JSON.parse(raw);



        if(
          Array.isArray(questions) &&
          questions.length>0
        ){

          firstQuestion =
            questions[0];

        }


      }


    }catch(error){

      console.error(
        "Question parse error",
        error
      );

    }





    window.setTimeout(()=>{


      addAiBubble(
        firstQuestion
      );



      void startQuestionRef.current(
        firstQuestion
      );



    },1500);



  },[
    interviewSessionId
  ]);





  // Scroll transcript

  useEffect(()=>{


    transcriptEndRef.current
    ?.scrollIntoView({
      behavior:"smooth"
    });


  },[
    transcript
  ]);





  useEffect(()=>{


    setIsClientMounted(true);


  },[]);






  // ─────────────────────────────────────────────
  // End call
  // ─────────────────────────────────────────────

  const handleEndCall =
    async()=>{


      setIsEndingCall(true);



      if(streamRef.current){

        streamRef.current
        .getTracks()
        .forEach(
          track=>track.stop()
        );

      }



      videoStreamRef.current
      ?.close();




      try{


        await new Promise(
          resolve=>
            setTimeout(
              resolve,
              3000
            )
        );



        router.replace(
          "/feedback"
        );


      }catch(error){


        console.error(
          error
        );


        setIsEndingCall(false);

      }


    };





  const statusLabel =
    ()=>{


      if(isStartingInterview)

        return {
          icon:
            <Mic className="w-4 h-4 text-neutral-400"/>,

          text:
            "Starting interview..."
        };



      if(isAiSpeaking)

        return {
          icon:
            <Bot className="w-4 h-4 text-indigo-600"/>,

          text:
            "AI is speaking..."
        };



      if(isRecording)

        return {
          icon:
            <Mic className="w-4 h-4 text-red-500 animate-pulse"/>,

          text:
            "Listening..."
        };



      if(isTranscribing)

        return {
          icon:
            <Bot className="w-4 h-4 text-indigo-400"/>,

          text:
            "Processing answer..."
        };



      return {

        icon:
          <Mic className="w-4 h-4 text-neutral-400"/>,

        text:
          "Ready"

      };

    };



  const {
    icon:statusIcon,
    text:statusText
  } =
    statusLabel();  return (
    <>
      <EvaluatingLoader isOpen={isEndingCall} />

      <div className="min-h-screen w-full overflow-hidden bg-neutral-950 font-sans text-white">

        <div className="absolute inset-0 pointer-events-none opacity-40">

          <div className="
            absolute left-[12%] top-[10%]
            h-80 w-80 rounded-full
            bg-neutral-700/20 blur-3xl
          "/>


          <div className="
            absolute right-[10%] bottom-[8%]
            h-96 w-96 rounded-full
            bg-neutral-800/30 blur-3xl
          "/>

        </div>




        <div className="
          relative grid min-h-screen
          grid-cols-1 gap-6 p-4
          lg:grid-cols-[minmax(0,1fr)_420px]
          lg:p-6
        ">



          {
            predictionError &&
            !isEndingCall &&
            (
              <div className="
                absolute right-4 top-4 z-50
                rounded-md bg-red-500/90
                px-3 py-2 text-xs
                text-white shadow-lg
              ">
                Emotion API:
                {" "}
                {predictionError}
              </div>
            )
          }





          {
            audioError &&
            !isEndingCall &&
            (
              <div className="
                absolute right-4 top-14 z-50
                rounded-md bg-orange-500/90
                px-3 py-2 text-xs
                text-white shadow-lg
              ">
                Audio:
                {" "}
                {audioError}
              </div>
            )
          }







          {/* LEFT PANEL */}

          <div className="
            relative min-h-[calc(100vh-2rem)]
            overflow-hidden rounded-[28px]
            border border-white/10
            bg-gradient-to-br
            from-neutral-900
            via-neutral-900
            to-neutral-950
            shadow-2xl
            lg:min-h-[calc(100vh-3rem)]
          ">



            <div className="
              absolute inset-0
              pointer-events-none
              opacity-[0.06]
              [background-image:radial-gradient(#fff_1px,transparent_1px)]
              [background-size:28px_28px]
            "/>






            {/* Timer */}

            <div className="
              absolute left-6 right-6 top-6
              z-20 flex items-center justify-between
            ">


              <div className="
                flex items-center gap-3
                rounded-full
                border border-white/10
                bg-black/30
                px-4 py-2
                backdrop-blur-md
              ">

                <div className="
                  h-2 w-2 rounded-full
                  bg-red-500 animate-pulse
                "/>


                <span className="
                  text-xs font-bold
                  tracking-widest uppercase
                ">
                  Live Recording
                </span>


                <span className="
                  border-l border-white/20
                  pl-3
                  font-mono text-xs
                ">
                  {formatTime(elapsedSeconds)}
                </span>

              </div>


            </div>







            {/* Main AI / Camera View */}

            <div
              className="
                absolute inset-8
                top-24 bottom-28
                z-10 flex
                items-center justify-center
                rounded-3xl
              "

              onDoubleClick={()=>
                setIsSwapped(
                  previous=>!previous
                )
              }

            >


              {
                isSwapped
                ?

                <div className="
                  h-full w-full
                  overflow-hidden
                  rounded-3xl
                  border border-white/10
                  shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                ">

                  <CameraFeed

                    isMain={true}

                    videoRef={videoRef}

                    cameraError={cameraError}

                    emotion={emotion}

                    confidence={confidence}

                  />


                </div>


                :

                <AiAvatar

                  isMain={true}

                  isAiSpeaking={isAiSpeaking}

                />

              }



            </div>









            {/* Floating camera */}

            {
              isClientMounted &&
              !isEndingCall &&
              (

                <Rnd

                  default={{
                    x:28,

                    y:
                    typeof window!=="undefined"
                    ?
                    window.innerHeight-290
                    :
                    0,

                    width:340,

                    height:210,

                  }}


                  minWidth={250}

                  minHeight={150}

                  bounds="window"

                  className="z-40"

                >


                  <div className="
                    relative
                    h-full w-full
                    overflow-hidden
                    rounded-3xl
                    border border-white/10
                    bg-neutral-900
                    shadow-2xl
                    backdrop-blur-md
                  ">


                    {

                      isSwapped

                      ?

                      <AiAvatar

                        isMain={false}

                        isAiSpeaking={
                          isAiSpeaking
                        }

                      />

                      :

                      <CameraFeed

                        isMain={false}

                        videoRef={
                          videoRef
                        }

                        cameraError={
                          cameraError
                        }

                        emotion={
                          emotion
                        }

                        confidence={
                          confidence
                        }

                      />

                    }


                  </div>



                </Rnd>

              )
            }








            {/* End Call */}

            <div className="
              absolute bottom-8 right-8
              z-20
            ">

              <button

                onClick={
                  handleEndCall
                }

                disabled={
                  isEndingCall
                }


                className="
                  flex items-center gap-2
                  rounded-2xl
                  bg-red-600
                  px-6 py-4
                  font-medium
                  text-white
                  shadow-xl
                  transition
                  hover:bg-red-700
                  disabled:opacity-50
                "

              >

                <PhoneOff
                  className="h-5 w-5"
                />

                End Call

              </button>


            </div>



          </div>









          {/* RIGHT PANEL */}

          <TranscriptPanel

            transcript={
              transcript
            }

            transcriptEndRef={
              transcriptEndRef
            }

            statusIcon={
              statusIcon
            }

            statusText={
              statusText
            }

          />



        </div>


      </div>

    </>
  );
}