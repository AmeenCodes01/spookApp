"use client";
import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MiniGame from "../components/MiniGame";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {Id, Doc} from "../../../convex/_generated/dataModel";
import {Button} from "@/components/ui/button";
const txt = {
  winner: {
    title: "Congrats, murderer",
    desc: "You just killed your classmate to lower the grade boundaries.",
  },
  loser: {
    title: "Don't bother",
    desc: "even studying. You have been chosen to be the sacrifice to lower the grade boundaries",
  },
};

const GamePage = () => {
  const [result, setResult] = useState(-1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [otherPlayer, setOtherPlayer] = useState<null | Id<"users">>(null);
  const changeStatus = useMutation(api.users.changeStatus);
  const [id, setId] = useState<Id<"users"> | null>(null);
  const [showRev, setShowRev] = useState(false);
  // -1 wait, 0 lost, 1 win
  useEffect(() => {
    const storedId = localStorage.getItem("userID");
    if (storedId) {
      setId(storedId as Id<"users">);
      changeStatus({
        status: "waiting",
        id: storedId as Id<"users">,
      });
    }
  }, []);

  const users = useQuery(api.users.getAll) || [];
  console.log("users", result);

  const user = useQuery(api.users.getUser, {id: id as Id<"users">});

  useEffect(() => {
    if (user) {
      const classMate = users.filter(
        (u) =>
          u._id !== user._id &&
          u.class === user.class &&
          u.school === user.school &&
          u.status === "waiting" &&
          u.inFight === false
      );

      if (user.status == "lost") {
        setIsDialogOpen(true);
        setResult(0);
      }
      if (classMate.length > 0) {
        setOtherPlayer(classMate[0]._id);

        changeStatus({
          id: id as Id<"users">, // Ensure `id` is not null
          classmateId: classMate[0]._id as Id<"users">,
          status: "fighting",
          classmateStatus: "fighting",
        });
      }
    }
  }, [users, user, id]);

  const handleUpdate = (value: number) => {
    setResult(value);
    setIsDialogOpen(true);

    if (id && otherPlayer) {
      changeStatus({
        id,
        status: "won",
        classmateId: otherPlayer,
        classmateStatus: "lost",
      });
    }
  };

  if (!otherPlayer) {
    return (
      <p className="font-nosifer text-2xl p-10 border-2 text-green-700 bg-black text-center w-full h-full text-4xl ">
        Just Wait <br />
        <span className="font-mono italic">
          not like you can do anything now
        </span>
      </p>
    );
  }
  return (
    <div className="bg-black flex w-full h-full justify-center items-center overflow-hidden relative">
      {result === 1 && (
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover">
          <source src="/blood.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      <div className="relative z-10 flex items-center justify-center h-full text-white">
        {otherPlayer !== null ? <MiniGame handleUpdate={handleUpdate} /> : ""}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="py-20 bg-red-600">
            <DialogHeader>
              <DialogTitle className="text-3xl text-black">
                {result === 1 ? txt.winner.title : txt.loser.title}
              </DialogTitle>
              <DialogDescription className="text-red-900 font-semibold text-2xl">
                {result === 1 ? txt.winner.desc : txt.loser.desc}
              </DialogDescription>

              {result == 0 && !showRev && (
                <Button
                  className="bg-green-500 rounded-none py-4"
                  onClick={() => setShowRev(true)}>
                  Take Revenge
                </Button>
              )}
              {showRev && (
                <p className="text-red-900 font-semibold text-2xl">
                  We'll help you haunt them all forever
                </p>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GamePage;
