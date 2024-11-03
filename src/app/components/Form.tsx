"use client";
import {Input} from "@/components/ui/input";
import {useMutation} from "convex/react";
import {useRouter} from "next/navigation";
import {FormEvent} from "react";
import {api} from "../../../convex/_generated/api";
import {Button} from "@/components/ui/button";

const formFields = ["name", "class", "school"];

function Form() {
  const router = useRouter();
  const createUser = useMutation(api.users.createUser);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString() || "";
    const userClass = formData.get("class")?.toString() || "";
    const school = formData.get("school")?.toString() || "";
    const date = formData.get("date")?.toString() || "";

    if (name && name.length > 0 && userClass && school && date) {
      // Call createUser only if all fields are valid
      const result = await createUser({
        name,
        class: userClass,
        school,
        date,
      });
      localStorage.setItem("userID", result);
    }
    router.push("/fakedate");
  }
  return (
    <div className="border-2 flex flex-col justify-center items-center gap-8 bg-blue-100  h-full w-full">
      <h1 className="text-3xl  self-center font-bold ">ExamReminder</h1>
      <form className="flex gap-4 flex-col p-2 w-fit" onSubmit={onSubmit}>
        {formFields.map((plc) => (
          <Input placeholder={plc} name={plc} key={plc} />
        ))}
        <input type="date" name="date" className="border-2" />

        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}

export default Form;
