import { useEffect, useState } from "react";

function Loading() {
  const [counter, setCounter] = useState(0);
  const [counterArr, setCounterArr] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counter + 1);
    }, 200);

    if (counter > 3) {
      setCounter(0);
      setCounterArr([]);
    } else {
      setCounterArr([...counterArr, counter + 1]);
    }

    return () => {
      clearInterval(interval);
    };
  }, [counter]);
  console.log("counter", counter, counterArr);

  return (
    <div className=" m-auto flex h-screen flex-col justify-center text-center text-lg font-bold">
      <h2 className="font-mono text-lg">Loading</h2>
      <div className="flex flex-row items-center justify-center">
        {counterArr?.map((index) => (
          <div className="m-1 h-5 w-5 bg-black" key={index} />
        ))}
      </div>
    </div>
  );
}

export default Loading;
