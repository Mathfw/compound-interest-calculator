import './App.css';

import React, { useState, type FormEvent } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTranslation } from 'react-i18next'

import Input from './components/Input'
import { CustomLegend } from './components/CustomLegend';
import { CustomTooltip } from './components/CustomTooltip';

import { LangContext } from './contexts/LangContext';
import { ThemeContext } from './contexts/ThemeContext';

import FlagUS from './assets/flag-US.svg?react'
import FlagBR from './assets/flag-BR.svg?react'
import Moon from './assets/moon.svg?react'
import Sun from './assets/sun.svg?react'

function App(): React.ReactNode {

  const [start, setStart] = useState('');
  const [monthly, setMonthly] = useState('');
  const [interest, setInterest] = useState('');
  const [period, setPeriod] = useState('');

  const [interestMetric, setInterestMetric] = useState<'months'|'years'>('months');
  const [periodMetric, setPeriodMetric] = useState<'months'|'years'>('months');

  const [outTable, setOutTable] = useState<{earnings: number, invested: number, tottalEarnings: number,  total: number}[] | null>(null);
  const [outChart, setOutChart] = useState<{earnings: string, invested: string, gross: string, month: string}[] | null>(null);

  const [lang, setLang] = useState('en-US');

  const [theme, setTheme] = useState('light');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let calc: {
      start: number,
      monthly: number,
      interest: number,
      period: number
    } = {start: 0, monthly: 0, interest: 0, period: 0}
    if (lang === 'pt-BR') {
      calc.start = parseFloat(start.replace('.', '<temp-comma>').replace(',', '.').replace('<temp-comma>', ''));
      calc.monthly = parseFloat(monthly.replace('.', '<temp-comma>').replace(',', '.').replace('<temp-comma>', ''));
      calc.interest = interestMetric === 'years' ?  
        parseFloat(interest.replace('.', '<temp-comma>').replace(',', '.').replace('<temp-comma>', '')) / 12 / 100 : 
        parseFloat(interest.replace('.', '<temp-comma>').replace(',', '.').replace('<temp-comma>', '')) / 100;
      calc.period = periodMetric === 'years' ? Math.floor(parseInt(period) * 12) : parseInt(period);
    } else {
      calc.start = parseFloat(start.replace(',', ''));
      calc.monthly = parseFloat(monthly.replace(',', ''));
      calc.interest = interestMetric === 'years' ?
        parseFloat(interest.replace(',', '')) / 12 / 100 :
        parseFloat(interest.replace(',', '')) / 100;
      calc.period = periodMetric === 'years' ? Math.floor(parseInt(period) * 12) : parseInt(period);
    } 
    let outTableTemp: {earnings: number, invested: number, tottalEarnings: number,  total: number}[] = [];
    let outChartTemp: {earnings: string, invested: string, gross: string, month: string}[] = []; 
    let total = 0, invested = calc.start, totalEarnings = 0;
    for (let i = 0; i < calc.period; i++) {
      total = calc.start * Math.pow(1+calc.interest, 1);
      totalEarnings += total - calc.start >= 0 ? total - calc.start : 0;
      outTableTemp.push({
        earnings: total - calc.start >= 0 ? total - calc.start : 0, 
        invested: invested, 
        tottalEarnings: totalEarnings,
        total: total
      })
      outChartTemp.push({
        earnings: totalEarnings.toFixed(2),
        invested: invested.toFixed(2),
        gross: total.toFixed(2),
        month: i.toString()
      })
      calc.start = total;
      calc.start += calc.monthly;
      invested += calc.monthly;
    }
    setOutTable(outTableTemp);
    setOutChart(outChartTemp);
  }

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  return (
    <LangContext value={{value: lang, setValue: setLang}}>
      <ThemeContext value={{value: theme, setValue: setTheme}}>
        <main className={`container ${theme}`}>
          <h1 className='title'>{t('compound_interest_calculator')}</h1>
          <button className='button button--icon button--outlined' onClick={() => {
              changeLanguage('pt');
              setLang('pt-BR');
            }}>
            <FlagBR />
          </button>
          <button className='button button--icon button--outlined' onClick={() => { 
              changeLanguage('en');
              setLang('en-US');
            }}>
            <FlagUS />
          </button>
          <button className='button button--icon button--outlined' onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            { theme === 'light' ? <Moon /> : <Sun /> }
          </button>
          <form onSubmit={handleSubmit} className='form'>
            <Input value={start} type='money' setValue={(v) => setStart(v)} >
              {t('start_investment_value')}
            </Input>
            <Input value={monthly} type='money' setValue={(v) => setMonthly(v)} >
              {t('monthly_investment_value')}
            </Input>
            <Input value={interest} type='metric' setValue={(v) => setInterest(v)} metricLabel={t('__in__')} metricValue={interestMetric} 
              setMetric={(v) => {
                if (v === 'months' || v === 'years') {
                  setInterestMetric(v)
                }
              }}>
                {t('interest_rate')}
            </Input>
            <Input value={period} type='metric' setValue={(v) => setPeriod(v)} metricLabel={t('__in__')} metricValue={periodMetric} 
              setMetric={(v) => {
                if (v === 'months' || v === 'years') {
                  setPeriodMetric(v)
                }
              }} >
                {t('period_of_the_investment')}
            </Input>
            <button className='button button--primary' type='submit'>
              {t('calculate')}
            </button>
          </form>
          {
            outChart ?
            <div className='chart'>
              <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={outChart}>
                    <Line type='monotone' dataKey='gross' stroke='#ff0000' />
                    <Line type='monotone' dataKey='invested' stroke='#00ff00' />
                    <CartesianGrid strokeDasharray='5 5' />
                    <YAxis domain={[0, parseFloat(outChart[outChart.length - 1].gross)]} />
                    <XAxis dataKey='month' />
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend verticalAlign='top' height={36} content={<CustomLegend/>} />
                  </LineChart>
              </ResponsiveContainer> 
            </div>:
            null
          }
          {
            outTable ?
            <table className='table'>
              <thead className='table__head'>
                <tr className='table__row'>
                  <th className='table__field'>{t('month')}</th>
                  <th>{t('monthly_earnings')}</th>
                  <th>{t('total_invested')}</th>
                  <th>{t('total_earnings')}</th>
                  <th>{t('total_Accumulated')}</th>
                </tr>
              </thead>
              <tbody className='table__body'>
                {
                  outTable.map((v, index) => {
                    return(
                      <tr key={index} className='table__row'>
                        <td className='table__field'>{index}</td>
                        <td className='table__field'>{v.earnings.toFixed(2)}</td>
                        <td className='table__field'>{v.invested.toFixed(2)}</td>
                        <td className='table__field'>{v.tottalEarnings.toFixed(2)}</td>
                        <td className='table__field'>{v.total.toFixed(2)}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table> :
            null
          }
        </main>
      </ThemeContext>
    </LangContext>
  )
}

export default App
