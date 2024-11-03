"use client";
import React, {useState, useEffect} from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
function FakeDate() {
  const [bgStyle, setBgStyle] = useState("blue");
  const [agree, setAgree] = useState(false);
  useEffect(() => {
    // Set background to GIF after 1 second
    const gifTimeout = setTimeout(() => {
      setBgStyle("gif");
      console.log("gif set");
    }, 3000);

    // Set background to black after 40 seconds
    const blackTimeout = setTimeout(() => {
      setBgStyle("black");
      console.log("black set");
    }, 4000);

    // Clean up timeouts on component unmount
    return () => {
      clearTimeout(gifTimeout);
      clearTimeout(blackTimeout);
    };
  }, []);
  console.log(bgStyle);
  const bg =
    bgStyle === "blue"
      ? "bg-blue-200"
      : bgStyle === "gif"
        ? "bg-glitch"
        : "bg-black";
  console.log(bg, "bg");
  return (
    <div
      className={` ${bg} h-full   w-full flex justify-center items-center flex-col`}>
      {bgStyle == "blue" && (
        <>
          <Image
            src={"/cheer.gif"}
            width={500}
            height={500}
            alt="Picture of the author"
          />
          <p className="pt-4 text-2xl text-blue-700 font-bold self-center italic">
            We will send you a gift and reminder one day before your exam. Good
            Luck!
          </p>
        </>
      )}

      {bgStyle === "black" && (
        <div className="flex flex-col gap-8 ">
          <div className="border-2 border-red-600 p-16">
            <p className="text-red-800 text-3xl font-mono font-black ">
              The exam is today, <span className="font-nosifer">you idiot</span>
            </p>
          </div>
          <div className="border-2 border-green-400 p-16 flex items-center flex-col w-fit self-center mx-auto gap-2">
            <p className="text-green-600 text-center font-2xl font-mono italic ">
              You still have a chance. <br />
              Sign a contract <br />
              & <br />
              you shall pass
            </p>
            <div
              onClick={() => setAgree((prev) => !prev)}
              className={` ${
                agree ? "bg-green-500" : "bg-black"
              } border-green-600
               size-4 border-[1px] self-center pt-4 `}></div>
            <Link href="/trial">
              <Button className="rounded-none border-green-500 text-green-400 bg-gray-800 ">
                Start Trial
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default FakeDate;
