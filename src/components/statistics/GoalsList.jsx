import { React, useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js'
import { getLenguage } from '../../utils/lenguage'

ChartJS.register(
  Title, Tooltip, LineElement, Legend,
  CategoryScale, LinearScale, PointElement, Filler
)

const GoalsList = ({ handleClickCode, handleClickName }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'statistics')
  const { worker } = globalData
  const [goals, setGoals] = useState()

  const { fetchData, data } = useFetch()
  useEffect(() => {
    if (worker) fetchData('/goals/getGoals/' + worker._id, { centro: globalData.center })
  }, [])
  useEffect(() => {
    if (data) {
      setGoals(Object.values(data))
    }
  }, [data])

  return (
    <>
    <div className='goals'>
      {
        goals
          ? <>
          <div className='goals_title'>
            <div className='goals_title_ind'>{leng.indicadores}</div>
            <div className='goals_title_res'>{leng.res}</div>
            <div className='goals_title_graf'>{leng.grafica}</div>
            <div className='goals_title_pend'>{leng.pacPend}</div>
            <div className='goals_title_puntos'>{leng.puntos}</div>
          </div>
            {
              goals.map((seccion, index) => {
                return (
                  <div key={index}>
                    <div className='goals_seccion'>
                      <div className='goals_seccion_seccion'>{seccion[0].tipo}</div>
                    </div>
                    {
                      seccion.map(goal => {
                        const graphData = {
                          labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
                          datasets: [
                            {
                              data: goal.months,
                              backgroundColor: '#1d8dc5',
                              borderColor: 'blue',
                              fill: true
                            }
                          ]
                        }
                        const options = {
                          plugins: {
                            legend: {
                              display: false
                            }
                          },
                          elements: {
                            point: {
                              radius: 0
                            }
                          },
                          scales: {
                            y: {
                              max: goal.pacientesTotales.length,
                              beginAtZero: true,
                              ticks: {
                                display: false
                              },
                              grid: {
                                drawTicks: false,
                                drawBorder: false
                              }
                            },
                            x: {
                              beginAtZero: true,
                              ticks: {
                                display: false
                              },
                              grid: {
                                drawTicks: false,
                                drawBorder: false
                              }
                            }
                          }
                        }
                        const pacientesACompletar = Math.ceil((goal.objetivo / 100) * goal.pacientesTotales.length) - goal.pacientesCompletados.length
                        let resultado = (goal.pacientesCompletados.length / goal.pacientesTotales.length) * 100
                        if (goal.pacientesCompletados.length === 0) resultado = 0
                        let colorRes
                        if (resultado < goal.objetivo / 2) colorRes = 'red'
                        else if (resultado < goal.objetivo) colorRes = 'yellow'
                        else colorRes = 'green'
                        let puntos
                        console.log(resultado)
                        if (resultado < goal.objetivo) puntos = Math.round((resultado * goal.puntosTotales) / goal.objetivo)
                        else puntos = goal.puntosTotales
                        return (
                          <div key={goal.codigo} className='goals_goal'>
                            <div onClick={() => { handleClickCode(goal) }} className='goals_goal_code'>{goal.codigo}</div>
                            <div onClick={() => { handleClickName(goal) }} className='goals_goal_name'>{goal.nombre}</div>
                            <div className={'goals_goal_resultado ' + colorRes} title={' Porcentaje a cumplir: ' + goal.objetivo + '%'}>{Math.round(resultado)}</div>
                            <div className='goals_goal_grafica'>
                              <Line data={graphData} options={options} height='30' width='80'></Line>
                            </div>
                            <div className='goals_goal_pac_pendientes'>{pacientesACompletar < 0 ? '0' : pacientesACompletar}</div>
                            <div className='goals_goal_puntos'>{puntos} de {goal.puntosTotales}</div>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
            }
          </>
          : null
      }
    </div>
    </>
  )
}

export default GoalsList
