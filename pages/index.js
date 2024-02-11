import Card from "@/components/cardItem";
import Loading from "@/components/loading";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useEffect, useState } from "react";

export default function Home(props) {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8];
  const [page, setPage] = useState(arr[0]);
  const [itemData, setItemData] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    const client = new ApolloClient({
      uri: "https://graphql-pokemon2.vercel.app",
      cache: new InMemoryCache(),
    });
    const pageNumber = page >= 4 ? page * 20 : 40;
    client
      .query({
        query: gql`
        query pokemons {
          pokemons(first: ${pageNumber}) {
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
      .then((e) => setItemData(page >= 4 ? e?.data?.pokemons : props.launches));
    setMainData(
      page < 4
        ? itemData?.slice((page - 1) * 20, page * 20)
        : itemData?.slice(Math.max(itemData.length - 20, 0)),
    );
  }, [page, itemData]);

  return (
    <main className="mx-auto px-20 py-10">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-mono text-2xl font-extrabold">AnimiBoard</h1>
        <div className="m-auto w-1/2 rounded-md border border-l-emerald-800 p-2">
          <input
            className="text outline-none"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            placeholder="search pokemon"
          />
        </div>
        <h1 className="font-mono text-sm font-bold text-red-500 underline">
          Logout
        </h1>
      </div>

      {mainData?.length === 0 ? (
        <>
          <Loading />
        </>
      ) : (
        <div className="grid grid-cols-1 gap-8 px-0 py-10 md:grid-cols-2 lg:grid-cols-4">
          {mainData
            ?.filter((item) =>
              item?.name
                ?.toLocaleLowerCase()
                .startsWith(searchItem?.toLocaleLowerCase()),
            )
            .map((item, index) => {
              const itemData1 = mainData?.filter((e) => e.id === item.id);
              return (
                <Card
                  isOnClick={true}
                  key={item.id}
                  itemData={itemData1}
                  id={item.id}
                  page={page}
                  image={item.image}
                  name={item.name}
                  number={item.number}
                  types={item.types}
                  width={""}
                />
              );
            })}
        </div>
      )}

      {mainData?.length === 0 && mainData.length > 0 && (
        <div className="flex flex-row items-center justify-center p-4">
          {arr.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => setPage(item)}
                className={`cursor-pointer border ${
                  page == index + 1 ? "bg-slate-300" : "white"
                } mr-3 rounded-md border-gray-400 p-3 hover:bg-slate-300`}
              >
                <p>{item}</p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://graphql-pokemon2.vercel.app",
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      query pokemons {
        pokemons(first: ${60}) {
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
