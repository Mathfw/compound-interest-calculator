import './App.css';

import React, { createContext, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTranslation } from 'react-i18next'

import Input from './components/Input'
import { CustomLegend } from './components/CustomLegend';
import { CustomTooltip } from './components/CustomTooltip';

import FlagUS from './assets/flag-US.svg?react'
import FlagBR from './assets/flag-BR.svg?react'

export const LangContext = createContext<{
  value: string,
  setValue: Dispatch<SetStateAction<string>>
}>({
  value: 'en-US',
  setValue: () => {}
});

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
    <main>
      <LangContext value={{value: lang, setValue: setLang}}>
        <h1>{t('compound_interest_calculator')}</h1>
        <button onClick={() => {
            changeLanguage('pt');
            setLang('pt-BR');
          }} style={{ width: '4em', height: '4em' }}>
          <FlagBR />
        </button>
        <button onClick={() => { 
            changeLanguage('en');
            setLang('en-US');
          }} style={{ width: '4em', height: '4em' }}>
          <FlagUS />
        </button>
        <form onSubmit={handleSubmit}>
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
          <button type='submit'>
            {t('calculate')}
          </button>
        </form>
        {
          outChart ?
          <div style={{ width: '600px', height: '400px' }}>
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
          <table>
            <thead>
              <tr>
                <th>{t('month')}</th>
                <th>{t('monthly_earnings')}</th>
                <th>{t('total_invested')}</th>
                <th>{t('total_earnings')}</th>
                <th>{t('total_Accumulated')}</th>
              </tr>
            </thead>
            <tbody>
              {
                outTable.map((v, index) => {
                  return(
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{v.earnings.toFixed(2)}</td>
                      <td>{v.invested.toFixed(2)}</td>
                      <td>{v.tottalEarnings.toFixed(2)}</td>
                      <td>{v.total.toFixed(2)}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table> :
          null
        }
      </LangContext>
    </main>
  )
}

export default App
