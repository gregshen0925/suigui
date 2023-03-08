import React from "react";
import { type Contact } from "../../../../types";
import { useDragAndDrop } from "../../../hooks/useDragAndDrop";

const Contacts: Contact[] = [
  {
    name: "Greg",
    address: "0x32921f6ffedd48fee8151da31dadeb42273c4a08",
  },
  {
    name: "Justa",
    address: "0xdcc363fd0aaa25765b156a9bac1e0e55d5ba47c4",
  },
];

const Contact = () => {
  const { handleOnDropToSend, enableDropping } = useDragAndDrop();
  return (
    <div>
      <div className="space-y-2">
        {Contacts.map((contact, index) => (
          <div
            key={index}
            onDragOver={enableDropping}
            onDrop={handleOnDropToSend}
          >
            <button className="w-full h-[80px] rounded-xl bg-white/20 hover:bg-white/50">
              <div className="flex flex-col items-center">
                <div className="font-bold"> {contact.name}</div>
                <div>{contact.address} </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
