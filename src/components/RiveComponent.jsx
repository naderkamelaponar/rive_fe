import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  useRive,
  Layout,
  Fit,
  Alignment,
  EventType,
  
} from "@rive-app/react-canvas";
import { createUser, getUser, deleteUser ,resendVerificationEmail} from "../../api";
const RiveComponent = () => {
  const canvasRef = useRef(null);
  const [text, setText] = useState("|");
  const [isFocused, setIsFocused] = useState(false);

  const { RiveComponent: RiveCanvas, rive } = useRive({
    src: "/nader_signup.riv",
    stateMachines: "MainSM",
    autoplay: true,
    artboard: "Mailing List",
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isFocused) {
        const char = event.key;
        console.log("Key pressed:", char);
        setText((prev) => {
          let newText = prev.replace("|", "");
          if (char === "Backspace") {
            newText = newText.slice(0, -1);
          } else if (char.length === 1) {
            newText += char;
          } else if (char === "Enter") {
            newText = newText.replace("|", "");
            return newText.toUpperCase();
          }
          newText += "|";
          return newText.toUpperCase();
        });
        if (char === "Enter") {
          setIsFocused(false);
          if (rive) {
            const isValid = isValidEmail(text.replace("|", ""));
            if (isValid) {
              rive.setTextRunValue("txtMailHeaderUp", "A valid email");
            } else {
              rive.setTextRunValue("txtMailHeaderUp", "Not a valid email");
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused, rive, text]);

  useEffect(() => {
    if (rive) {
      setText(rive.getTextRunValue("txtMailInput"));
    }
  }, [rive]);

  useEffect(() => {
    if (isFocused) {
      const cursorInterval = setInterval(toggleCursor, 500);

      return () => clearInterval(cursorInterval);
    }
  }, [isFocused]);

  const toggleCursor = () => {
    setText((prev) => {
      if (prev.endsWith("|")) {
        return prev.slice(0, -1);
      } else {
        return prev + "|";
      }
    });
  };
  //const setStateMachine = useStateMachineInput(rive, "MainSM", "AnimState", 1);

  const onRiveEventReceived = useCallback(
    async (riveEvent) => {
      const eventData = riveEvent.data;
      
      const { name } = eventData;
      if (name === "txtFiedMouseDown") {
        setIsFocused(true);
        if (!text.endsWith("|")) {
          setText(text + "|");
        }
        rive.setTextRunValue("txtMailHeaderUp", "");
      } else if (name === "btnSubmitClick") {
        rive.setTextRunValue("txtMailHeaderUp", "Hold on ...");
        setIsFocused(false);
        setText(text.replace("|",""))
        const email = text.replace("|", "").toLowerCase();
        if (email == "") {
          return rive.setTextRunValue(
            "txtMailHeaderUp",
            "please Enter the email"
          );
        }
        const isValid = isValidEmail(email);
        if (!isValid) {
          rive.setTextRunValue(
            "txtMailHeaderUp",
            "please Enter a valid email"
          );
          
        }
        const checkUser = await getUser(email);
        if (checkUser.exists) {
          const {user}=checkUser
          if (!user.verified) {
            rive.setTextRunValue(
              "txtMailHeaderUp",
              "Email Already Found But Not Verified!\nDo you wish to resend the verification request or remove your email from our system?"
            );
            setTimeout(()=>{
              rive.play("ButtonResendRemove")
            },3000)
          }else{
            rive.setTextRunValue(
              "txtMailHeaderUp",
              "Email Already Found!  Do you wish to remove your email from our mailing list system?"
            );
            setTimeout(()=>{
              rive.play("ButonYesNo")
            },3000)
          }
        } else {
          await createUser(email);
          rive.setTextRunValue(
            "txtMailHeaderUp",
            "Thank you for your Submission; please check your email to Verify your Registration."
          );
        }
      }
      if (name == "btnNoClick") {
        rive.setTextRunValue("txtMailHeaderUp", "");
        rive.play("InitAnim");
      }
      
      if (name == "btnRemoveClick" || name=="btnYesClick") {
        const email = text.replace("|", "").toLowerCase();
        await deleteUser(email);
        
        rive.setTextRunValue("txtMailHeaderUp", "email deleted from our list");
        rive.play("InitAnim")        
      }
      if (name=="btnResendClick"){
        const email = text.replace("|", "").toLowerCase();
        await resendVerificationEmail(email);
          rive.setTextRunValue("txtMailHeaderUp", "Verification email resent.");
        rive.play("InitAnim")
      }
    },
    [text, rive]
  );
  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };
  useEffect(() => {
    if (rive) {
      rive.setTextRunValue("txtMailInput", text);
      rive.on(EventType.RiveEvent, onRiveEventReceived);
    }
  
    // Cleanup function to remove the event listener
    return () => {
      if (rive) {
        rive.off(EventType.RiveEvent, onRiveEventReceived);
      }
    };
  }, [text, rive, onRiveEventReceived]);
  return (
    <div className="h-full w-full flex items-center justify-center">
      <RiveCanvas />
    </div>
  );
};

export default RiveComponent;
