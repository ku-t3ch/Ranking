import React from 'react'

import { useEffect } from 'react';

import ApexCharts from 'apexcharts';


export default function Chart(props) {
    const teamData = props.data
    const keys = []
    const values = []
    for (const teamObject of teamData) {
        for (const [key, value] of Object.entries(teamObject)) {
            keys.push(key);
            values.push(value);     
        }
    }

    useEffect(() => {
        var options = {
            chart: {
                type: 'donut'
            },
            series : values,
            labels: keys,
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name:{
                                show:true,
                                fontSize: 35,
                                fontWeight : 400
                            },
                            value : {
                                show:true,
                                fontSize: 30,
                                color : "#fff",
                                fontWeight : 600,
                                offSet: 30 ,
                            }
                        }
                    }
                }
            },
            dataLabels : {
                enacled : true,
                style :{
                    fontSize : 15,
                    fontWeight :400 ,
                    color : "#fff"
                }
            },
            legend:{
                labels :{
                        colors: "#fff",
                    },    
                fontSize: "24px", // Set the font size here

            }
        }
        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
        // Cleanup function (equivalent to componentWillUnmount for class components)
        return () => {
          chart.destroy();
        }
      }, [props.data]); // Empty dependency array means this effect runs once after the initial render

      return (
        <div id="chart" className='flex py-[2vh] ml-[3vw] md:w-[50vw] lg:w-[40vw]'></div>
        // Add other components or JSX as needed
      );
}
