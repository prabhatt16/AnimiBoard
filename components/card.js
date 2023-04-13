import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Card({ image, name, number, types, id, page, isOnClick }) {
  const router = useRouter();

  function handleChange(id, name) {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "data",
        JSON.stringify({
          itemId: id.toString(),
          itemName: name.toString(),
          pageNumber: page.toString(),
        })
      );
    }
    router.push("/" + id);
  }

  return (
    <div
      onClick={isOnClick ? () => handleChange(id, name) : () => {}}
      className={`flex flex-col items-left space-y-1 p-3 mb-4 border border-gray rounded-md cursor-pointer`}
    >
      <div className="w-full flex justify-center">
        <img className="h-28 w-24 object-fill" src={image} />
      </div>
      <p className=" text-gray-500">#{number}</p>
      <h3 className=" font-semibold text-lg">{name}</h3>
      <div className="flex flex-row justify-between items-center w-full">
        {types?.map((item, index) => {
          return (
            <div
              key={index}
              className={` ${
                index === 0 ? "bg-orange-400" : "bg-red-400"
              } rounded-sm px-6 py-1 text-white text-sm`}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Card;
