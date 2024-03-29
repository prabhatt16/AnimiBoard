import Card from "@/components/cardItem";
import Loading from "@/components/loading";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";

function CardItemDetails(props) {
  const [data, setData] = useState({});
  const [evolutionData, setEvolutionData] = useState({});
  const [showEvolution, setShowEvolution] = useState(false);

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    content: {
      width: "70%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "50%",
      transform: "translate(-50%, -50%)",
      borderWidth: 3,
      borderColor: "#000",
    },
  };

  const getAccessToken = () => {
    if (typeof window !== "undefined") return localStorage.getItem("data");
  };

  const getEvolutionData = useCallback(() => {
    const localData = JSON.parse(getAccessToken());
    const client = new ApolloClient({
      uri: "https://graphql-pokemon2.vercel.app",
      cache: new InMemoryCache(),
    });
    client
      .query({
        query: gql`
        query pokemon{
          pokemon(id: "${localData?.itemId}", name: "${localData?.itemName}"){
              id
              number
              name
              evolutions {
                id
                number
                name
                classification
                types
                resistant
                weaknesses
                fleeRate
                maxCP
                # evolutions{
                #   ...RecursivePokemonFragment
                # }
                maxHP
                image
              }
            }
          }
        `,
      })
      .then((e) => {
        setEvolutionData(e?.data?.pokemon);
      });
  }, [showEvolution]);

  useEffect(() => {
    const localData = JSON.parse(getAccessToken());
    if (localData?.pageNumber === 1) {
      const itemData = props?.launches?.filter(
        (item) => item.id === localData?.itemId
      );
      setData(itemData && itemData[0]);
    } else {
      const client = new ApolloClient({
        uri: "https://graphql-pokemon2.vercel.app",
        cache: new InMemoryCache(),
      });
      client
        .query({
          query: gql`
          query pokemon{
            pokemon(id: "${localData?.itemId}", name: "${localData?.itemName}"){
                id
                number
                name
                weight {
                  minimum
                  maximum
                }
                height {
                  minimum
                  maximum
                }
                classification
                types
                resistant
                weaknesses
                fleeRate
                maxCP
                maxHP
                image
              }
            }
          `,
        })
        .then((e) => {
          setData(e?.data?.pokemon);
        });
    }
  }, [props.launches]);

  return (
    <div className="flex items-start justify-center">
      {data === null || !data ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className=" flex h-full w-3/5 flex-col items-center justify-between bg-gray-100 px-6 pb-6">
          <div className=" shadow-sm flex flex-row items-center justify-center w-60 bg-white shadow-slate-300 rounded-br-2xl rounded-bl-2xl py-2">
            <p className=" text-2xl font-bold ">{data?.name} </p>
            <p className=" pl-3 text-xl text-gray-500"> #{data?.number}</p>
          </div>
          <div className="flex w-full flex-row flex-wrap items-center justify-evenly py-10">
            <img
              src={data?.image}
              className=" rounded-md object-contain lg:h-60  lg:w-64"
            />
            <div className=" md:w-max lg:w-1/3 ">
              <div className=" mb-4 rounded-md bg-blue-400 p-4">
                <div className="flex flex-row items-center justify-between py-2 text-left">
                  <div>
                    <p className="text-md font-extrabold text-white">Height</p>
                    <h3 className="text-sm font-semibold">
                      {data?.height?.maximum}
                    </h3>
                  </div>
                  <div>
                    <p className="text-md font-extrabold text-white">Weight</p>
                    <h3 className="text-sm font-semibold">
                      {data?.weight?.maximum}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between py-2 text-left">
                  <div>
                    <p className="text-md font-extrabold text-white">
                      Classification
                    </p>
                    <h3 className="text-sm font-semibold">
                      {data?.classification}
                    </h3>
                  </div>
                  <div>
                    <p className="text-md font-extrabold text-white">
                      Flee Rate
                    </p>
                    <h3 className="float-right text-sm font-semibold">
                      {data?.fleeRate}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <p className="mb-2 font-bold">Types</p>
                <div className="flex flex-row flex-wrap">
                  {data?.types?.map((item, index) => (
                    <div
                      key={index}
                      className="mb-3 mr-3 w-fit rounded-md bg-orange-400 px-6 py-1"
                    >
                      <p className=" text-sm font-semibold text-white">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="">
                <p className="mb-2 font-bold">Weaknesses</p>
                <div className="flex flex-row flex-wrap">
                  {data?.weaknesses?.map((item, index) => (
                    <div
                      key={index}
                      className="mb-3 mr-3 w-fit rounded-md bg-orange-400 px-6 py-1"
                    >
                      <p className=" text-sm font-semibold text-white">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="my-4">
                <p className="mb-2 font-bold">Resistant</p>
                <div className="flex flex-row flex-wrap">
                  {data?.resistant?.map((item, index) => (
                    <div
                      key={index}
                      className="mb-3 mr-3 w-fit rounded-md bg-orange-400 px-6 py-1"
                    >
                      <p className=" text-sm font-semibold text-white">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              setShowEvolution(!showEvolution);
              getEvolutionData();
              document.body.style.overflow = "hidden";
            }}
            className="m-auto mt-0 w-fit rounded-md bg-black p-3"
          >
            <h3 className="text-md px-12 text-center font-mono font-extrabold text-white">
              Evolution
            </h3>
          </div>
          <Modal
            isOpen={showEvolution}
            onRequestClose={() => setShowEvolution(false)}
            style={customStyles}
          >
            <div className="flex flex-row items-center justify-between py-2">
              <h3 className=" text-lg font-semibold">Evolutions</h3>
              <button
                className="font-mono font-extrabold text-blue-500"
                onClick={() => setShowEvolution(false)}
              >
                Close
              </button>
            </div>
            <div className="flex flex-row flex-wrap justify-evenly px-3">
              {evolutionData?.evolutions !== null ? (
                evolutionData?.evolutions?.map((item, index) => {
                  return (
                    <div className="sm:w-full lg:w-1/3" key={index}>
                      <Card
                        isOnClick={false}
                        key={item.id}
                        id={item.id}
                        image={item.image}
                        name={item.name}
                        number={item.number}
                        types={item.types}
                      />
                    </div>
                  );
                })
              ) : (
                <h2>No Evolution found 🫤</h2>
              )}
            </div>
          </Modal>
        </div>
      )}{" "}
    </div>
  );
}

export async function getStaticPaths() {
  return {
    fallback: "blocking",
    paths: [],
  };
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://graphql-pokemon2.vercel.app",
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      query pokemons {
        pokemons(first: 20) {
          id
          number
          name
          weight {
            minimum
            maximum
          }
          height {
            minimum
            maximum
          }
          classification
          types
          resistant
          weaknesses
          fleeRate
          maxCP
          maxHP
          image
        }
      }
    `,
  });
  return {
    props: {
      launches: data.pokemons,
    },
  };
}

export default CardItemDetails;
