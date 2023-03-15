import React from "react";
import { type Contact } from "../../../../types";
import { useSendDnD } from "../../../hooks/DragAndDrop/useSendDnD";

const Contacts: Contact[] = [
  {
    name: "Greg",
    address: "0x32921f6ffedd48fee8151da31dadeb42273c4a08",
  },
  {
    name: "Justa",
    address: "0xf76079f179d6a75914f682065f34c344a91b4a55",
  },
];

const Contact = () => {
  const {
    handleOnDropToSend,
    handleDragOverToSend,
    isDragOverToSend,
    handleOnDragLeaveContact,
  } = useSendDnD();

  return (
    <div>
      <div className="space-y-2">
        {Contacts.map((contact, index) => (
          <div
            key={index}
            onDrop={(e) => handleOnDropToSend(e, contact.address)}
            onDragOver={(e) => handleDragOverToSend(e, contact.address)}
            onDragLeave={handleOnDragLeaveContact}
          >
            <button
              className={`${
                isDragOverToSend == contact.address ? "scale-105" : ""
              } duration-200 transition w-full h-[80px] rounded-xl bg-white/20 hover:bg-white/50`}
            >
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
