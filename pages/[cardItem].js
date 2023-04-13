import Card from "@/components/cardItem";
import Loading from "@/components/loading";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
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
      width: "60%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "50%",
      transform: "translate(-50%, -50%)",
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
    <div className="flex justify-center items-start">
      {data === null || data === {} ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className=" bg-gray-100 flex flex-col justify-between items-center w-5/6 h-full p-6">
          <div className="flex flex-row justify-center items-center">
            <p className=" text-2xl font-bold ">{data?.name} </p>
            <p className=" text-gray-500 text-xl pl-3"> #{data?.number}</p>
          </div>
          <div className="flex flex-row justify-evenly items-center flex-wrap w-full py-10">
            <img
              src={data?.image}
              className=" rounded-md lg:w-64 lg:h-60  object-contain"
            />
            <div className=" md:w-max lg:w-1/3 ">
              <div className=" bg-blue-400 rounded-md p-4 mb-4">
                <div className="flex flex-row justify-between items-center py-2 text-left">
                  <div>
                    <p className="text-white text-md">height</p>
                    <h3 className="text-sm">{data?.height?.maximum}</h3>
                  </div>
                  <div>
                    <p className="text-white text-md">Weight</p>
                    <h3 className="text-sm">{data?.weight?.maximum}</h3>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center py-2 text-right">
                  <div>
                    <p className="text-white text-md">Classification</p>
                    <h3 className="text-sm">{data?.classification}</h3>
                  </div>
                  <div>
                    <p className="text-white text-md">Flee Rate</p>
                    <h3 className="text-sm">{data?.fleeRate}</h3>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <p className="mb-2">Types</p>
                <div className="flex flex-row flex-wrap">
                  {data?.types?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-orange-400 rounded-sm px-6 mr-3 mb-3 w-fit py-1"
                    >
                      <p className=" text-white text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="">
                <p className="mb-2">Weaknesses</p>
                <div className="flex flex-row flex-wrap">
                  {data?.weaknesses?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-orange-400 rounded-sm px-6 mr-3 mb-3 w-fit py-1"
                    >
                      <p className=" text-white text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2">Resistant</p>
                <div className="flex flex-row flex-wrap">
                  {data?.resistant?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-orange-400 rounded-sm px-6 mr-3 mb-3 w-fit py-1"
                    >
                      <p className=" text-white text-sm">{item}</p>
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
              document.body.style.overflow='hidden';
            }}
            className="bg-black mt-0 p-3 m-auto rounded-md w-fit"
          >
            <h3 className="text-white text-md text-center">Evolution</h3>
          </div>
          <Modal
            isOpen={showEvolution}
            onRequestClose={() => setShowEvolution(false)}
            style={customStyles}
          >
            <div className="flex flex-row justify-between items-center py-2">
              <h3 className=" font-semibold text-lg">Evolutions</h3>
              <button
                className=" text-blue-400"
                onClick={() => setShowEvolution(false)}
              >
                Close
              </button>
            </div>
            <div className="flex flex-row justify-evenly flex-wrap px-3">
              {evolutionData?.evolutions !== null ? (
                evolutionData?.evolutions?.map((item, index) => {
                  return (
                    <div className="sm:w-full lg:w-1/2">
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
    fallback: 'blocking',
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
