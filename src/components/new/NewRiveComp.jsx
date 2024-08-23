import React, { useRef, useEffect, useState } from "react";
import RiveCanvas from "@rive-app/canvas-advanced";

const NewRiveComp = () => {
  const canvasRef = useRef(null);
  const [txtMail, setTxtMail] = useState("");
  const riveRef = useRef(null);

  useEffect(() => {
    async function main() {
      try {
        const rive = await RiveCanvas({
          locateFile: (_) =>
            "https://unpkg.com/@rive-app/canvas-advanced@2.17.3/rive.wasm",
        });

        const response = await fetch("/nmailing_list_signup.riv");
        if (!response.ok) {
          throw new Error(`Failed to load Rive file: ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        const file = await rive.load(new Uint8Array(buffer));

        const artboard = file.defaultArtboard();
        if (!artboard) {
          throw new Error("Artboard not found");
        }

        const animation = new rive.LinearAnimationInstance(
          artboard.animationByIndex(1),
          artboard
        );
        if (!animation) {
          throw new Error("Animation not found");
        }
        const mainSm = artboard.stateMachineByName("MainSM");
        const stateMachine = new rive.StateMachineInstance(mainSm, artboard);
        if (!stateMachine) {
          throw new Error("State machine not found");
        }
        const renderer = new rive.CanvasRenderer(canvasRef.current);
        artboard.advance(0);
        artboard.draw(renderer);
        let lastTime = 0;
        function drawFrame(time) {
          const elapsedTimeMs = time - lastTime;
          const elapsedTimeSec = elapsedTimeMs / 1000;
          lastTime = time;
          // here as mentioned in
          // https://rive.app/community/doc/rive-events/docbOnaeffgr
          // in the "Low-level API usage"  section
          if (stateMachine) {
            const numFiredEvents = stateMachine.reportedEventCount();
            console.log(numFiredEvents);
          }
          // it always returns 0 
          

          stateMachine.advance(elapsedTimeSec);
          renderer.clear();
          artboard.draw(renderer);
          requestAnimationFrame(drawFrame);
        }

        if (canvasRef.current) {
          rive.requestAnimationFrame(drawFrame);
        } else {
          console.error("Canvas not ready");
        }
        return () => {
          cancelAnimationFrame(animationFrameId); // Cleanup the animation frame upon component unmount
        };
      } catch (error) {
        console.error("Error loading Rive animation:", error);
      }
    }

    main();
  }, [txtMail]);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <canvas ref={canvasRef} className="" width="800" height="600" />
    </div>
  );
};

export default NewRiveComp;
