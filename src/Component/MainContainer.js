import React, { useEffect, useState } from 'react';

import Dashboard from './Dashboard';
import TeamRanking from './TeamRanking';
import Highest from './Checkpoint/Highest';
import Middle from './Checkpoint/Middle';
import Lowest from './Checkpoint/Lowest';

import logo from "../image/logo.png"
import { RxReload } from "react-icons/rx";


export default function MainContainer() {
    //loading status 
    const [isLoading,setIsLoading] = useState(false)
    //data status 
    const [checkpoint,setCheckPoint] = useState({
        max : 0,
        min : 0,
        avg : 0 , 
    })
    //data sorted
    const [sortedData,setSortedData] = useState([])
    //regular data 
    const [regularData,setRegularData] = useState([])

    const [lastedUpdated,setLastedUpdate] = useState(null)
    //example data 
    const exampleJsonNeed = [{'Team1': 9}, {'Team2': 40.5}, {'Team3': 9}, {'Team4': 1},{'Team5': 0},{"Team6": 15},{"Team7":4},{"Team8":6},{"Team9":5},{"Team10":6}]

    // Sorting function
    const sortingList = (targetData) => {
        const sortedData = targetData.slice().sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);
        return sortedData;
      }
    
    // Function to find the max minimum value
    function findMinMax(data) {
        // Initialize min and max variables with the first team's score
        let minScore = Object.values(data[0])[0];
        let maxScore = Object.values(data[0])[0];
      
        // Iterate through the rest of the teams to find min and max scores
        for (const team of data) {
          const score = Object.values(team)[0];
          minScore = Math.min(minScore, score);
          maxScore = Math.max(maxScore, score);
        }

        return {min: Number(minScore),max: Number(maxScore)}
      }
      
      const findAverageValue = (targetData) => {
        const totalScore = targetData.reduce((sum, team) => sum + Object.values(team)[0], 0);
        const averageScore = totalScore / targetData.length;
        return Number(averageScore.toFixed(2));
      };

    //call from server 
    const onGetDataFromServer = async ()=>{
        try{
            setIsLoading(true)
            // placholder 
            const response = await fetch ("https://api-ku-hackathon.vercel.app/api/scoreboard")
            const data = await response.json()
            return data 

        }catch(err){
            console.log(err)
        }
    }

  // Function to fetch data from the server
  const fetchDataFromServer = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://api-ku-hackathon.vercel.app/api/scoreboard");
      const data = await response.json();
      return data;
    // return exampleJsonNeed
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch data and update state
  const fetchDataAndUpdateState = async () => {
    try {
      const dataFromServer = await fetchDataFromServer();

      const sortedData = sortingList(dataFromServer);
      const result = findMinMax(sortedData);
      const prepareCheckpoint = {
        max: result.max,
        min: result.min,
        avg: findAverageValue(sortedData),
      };

      // Set state
      setSortedData(sortedData);
      setCheckPoint(prepareCheckpoint);
      setRegularData(dataFromServer);
    } catch (err) {
      console.error(`There's a problem: ${err}`);
    }
  };
  //page reloader
  const reloadPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    fetchDataAndUpdateState();
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLastedUpdate(currentTime)
    const intervalId = setInterval(fetchDataAndUpdateState,60000)
    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId)
  }, []); // Empty dependency array ensures that this effect runs only once on mount


    return (
    <div className="flex flex-col items-center mx-[3vw] my-[2vh] min-h-[94vh] max-h-[94vh] w-[94vw]">
        <header className='flex  flex-col text-center justify-center items-center'>
            <img src={`${logo}`} />
        </header>
        <div className="flex md:flex-row xs:flex-col justify-center items-center md:gap-x-[2vw] w-full">
            <Middle isLoading={isLoading}  avg={checkpoint.avg}/>           
            <Highest isLoading={isLoading}  max={checkpoint.max}/>
            <Lowest isLoading={isLoading}  min={checkpoint.min}/>
        </div>
        <div className=" flex md:flex-row xs:flex-col md:gap-x-[2vw] h-full mt-[3vh] w-full" >
            <Dashboard isLoading={isLoading}  teamData={regularData}/>
            <TeamRanking isLoading={isLoading} sortedData={sortedData}/>
        </div>
        {lastedUpdated && (
          <p className='flex flex-ro text-lg text-gray-600 mt-[1.5vh] items-center gap-x-[1vw]'>
            <RxReload onClick={reloadPage} className='hover:cursor-pointer'/>
            {lastedUpdated} Updated
          </p>
        )}
    </div>
    )
}
