import { useRouter } from "next/router";

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
        }),
      );
    }
    router.push("/" + id);
  }

  return (
    <div
      onClick={isOnClick ? () => handleChange(id, name) : () => {}}
      className={`items-left border-gray mb-4 flex cursor-pointer flex-col space-y-1 rounded-lg border-2 p-3`}
    >
      <div className="flex w-full justify-center">
        <img className="h-28 w-24 object-fill" src={image} />
      </div>
      <p className=" text-gray-500">#{number}</p>
      <h3 className=" text-lg font-semibold">{name}</h3>
      <div className="flex w-full flex-row items-center justify-between">
        {types?.map((item, index) => {
          return (
            <div
              key={index}
              className={` ${
                index === 0 ? "bg-orange-400" : "bg-red-400"
              } rounded-lg px-6 py-1 text-sm font-semibold text-white`}
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
