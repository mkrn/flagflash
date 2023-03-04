import Head from "next/head";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";
import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

import { countries } from "countries-list";

const keys = Object.keys(countries);

const getRandomCountry = () => {
  return keys[Math.floor(Math.random() * keys.length)];
};

function pickFourWithOne(arr, mustInclude) {
  // Create a new array that doesn't include the mustInclude item
  const newArr = arr.filter((item) => item !== mustInclude);

  // Shuffle the new array randomly
  newArr.sort(() => Math.random() - 0.5);

  // Take the first three items from the shuffled array
  const pickedItems = newArr.slice(0, 3);

  // Add the mustInclude item to the beginning of the array
  pickedItems.unshift(mustInclude);

  pickedItems.sort(() => Math.random() - 0.5);

  // Return the array with the four picked items
  return pickedItems;
}

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

export async function getServerSideProps(context) {
  return {
    props: {
      startcountry: getRandomCountry(),
    }, // will be passed to the page component as props
  };
}

export default function Home({ startcountry }) {
  const [country, setcountry] = useState(null);
  const [score, setscore] = useState(0);

  const [lives, setlives] = useState(5);
  const [randomCountries, setrandomCountries] = useState([]);

  const reset = () => {
    const startcountry = getRandomCountry();

    setcountry(startcountry);
    const randomCountries = pickFourWithOne(keys, startcountry);
    setrandomCountries(randomCountries);
  };

  useEffect(() => {
    reset();
  }, []);

  const Flag = ({ code }) => (
    <div>
      {/* {key} */}
      <Image
        src={require(`svg-country-flags/svg/${code.toLowerCase()}.svg`)}
        className="w-full shadow-lg	"
        alt="Flag"
      />
    </div>
  );

  return (
    <>
      <Head>
        <title>FlagFLASH</title>
        <meta name="description" content="Guess and learn the world flags" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="w-full mx-auto ">
          {/* <h1 className={`text-5xl text-center ${bebas.className}`}>
            FlagFLASH
          </h1> */}

          <div className="p-5 text-right">
            <span className={`text-xl ${bebas.className}`}>{score} </span>
            {Array.from({ length: lives }, (_, i) => (
              <span key={i}>❤️</span>
            ))}
          </div>

          {country && <Flag code={country} />}

          <div className="">
            {randomCountries.map((c) => (
              <button
                className={`p-5 ${bebas.className} block w-full`}
                key={c}
                onClick={() => {
                  if (c === country) {
                    // correcty !!
                    setscore(score + 1);
                    reset();
                  } else {
                    if (lives > 1) {
                      setlives(lives - 1);
                    } else {
                      setscore(0);
                      setlives(5);
                    }
                  }
                }}
              >
                {countries[c].name}
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
