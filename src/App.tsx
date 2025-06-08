import './App.css';

import React, { useState, type FormEvent } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTranslation } from 'react-i18next'

import Input from './components/Input'
import { CustomLegend } from './components/CustomLegend';
import { CustomTooltip } from './components/CustomTooltip';
import Select from './components/Select';

import { LangContext } from './contexts/LangContext';
import { ThemeContext } from './contexts/ThemeContext';

import FlagUS from './assets/flag-US.svg?react';
import FlagBR from './assets/flag-BR.svg?react';
import Moon from './assets/moon.svg?react';
import Sun from './assets/sun.svg?react';
import Whatsapp from './assets/whatsapp.svg?react';
import Email from './assets/email.svg?react';

function App(): React.ReactNode {

  const [start, setStart] = useState('');
  const [monthly, setMonthly] = useState('');
  const [interest, setInterest] = useState('');
  const [period, setPeriod] = useState('');

  const [interestMetric, setInterestMetric] = useState<'months'|'years'|''>('');
  const [periodMetric, setPeriodMetric] = useState<'months'|'years'|''>('');

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
    console.log(calc);
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
        <header className={`header ${theme}`}>
          <h1 className='header__title'>{t('compound_interest_calculator')}</h1>
          <div className='header__flags'>
            <button className='button button--icon button--outlined button--flag' onClick={() => {
                changeLanguage('pt');
                setLang('pt-BR');
              }}>
              <FlagBR />
            </button>
            <button className='button button--icon button--outlined button--flag' onClick={() => { 
                changeLanguage('en');
                setLang('en-US');
              }}>
              <FlagUS />
            </button>
          </div>
          <button className='button button--icon button--outlined button--theme' onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            { theme === 'light' ? <Moon /> : <Sun /> }
          </button>
        </header>
        <main className={`container ${theme}`}>
          <form onSubmit={handleSubmit} className='form'>
            <div className='form__field'>
              <Input value={start} type='money' setValue={(v) => setStart(v)} pattern='[0-9,.]+' required={true}>
                {t('start_investment_value')}
              </Input>
            </div>
            <div className='form__field'>
              <Input value={monthly} type='money' setValue={(v) => setMonthly(v)} pattern='[0-9,.]+' required={true}>
                {t('monthly_investment_value')}
              </Input>
            </div>
            <div className='form__field'>
              <Input value={interest} type='money' setValue={(v) => setInterest(v)} pattern='[0-9,.]+' required={true}>
                  {t('interest_rate')}
              </Input>
              <span className='form__field__separator'>{t('__in__')}</span>
              <Select 
                placeholder='select interest'
                options={['months', 'years']}
                onChange={(option) => {
                  if (option === 'months' || option === 'years') {
                    setInterestMetric(option)
                  }
                }}
              />
            </div>
            <div className='form__field'>
              <Input value={period} type='text' setValue={(v) => setPeriod(v)} pattern='[0-9,.]+' required={true}>
                  {t('period_of_the_investment')}
              </Input>
              <span className='form__field__separator'>{t('__in__')}</span>
              <Select 
                placeholder='select pediod'
                options={['months', 'years']}
                onChange={(option) => {
                  if (option === 'months' || option === 'years') {
                    setPeriodMetric(option)
                  }
                }}
              />
            </div>

            <button className='form__buttton button button--primary' type='submit'>
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
            <div className='table-container'>
              <table className='table'>
                <thead>
                  <tr className='table__row'>
                    <th className='table__head__field'>{t('month')}</th>
                    <th className='table__head__field'>{t('monthly_earnings')}</th>
                    <th className='table__head__field'>{t('total_invested')}</th>
                    <th className='table__head__field'>{t('total_earnings')}</th>
                    <th className='table__head__field'>{t('total_Accumulated')}</th>
                  </tr>
                </thead>
                <tbody className='table__body'>
                  {
                    outTable.map((v, index) => {
                      return(
                        <tr key={index} className='table__row'>
                          <td className='table__body__field'>{index}</td>
                          <td className='table__body__field'>{v.earnings.toFixed(2)}</td>
                          <td className='table__body__field'>{v.invested.toFixed(2)}</td>
                          <td className='table__body__field'>{v.tottalEarnings.toFixed(2)}</td>
                          <td className='table__body__field'>{v.total.toFixed(2)}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div> :
            null
          }
        </main>
        <footer className={`footer ${theme}`}>
          <div className='contact'>
            <span className='contact__icon'>
              <Whatsapp />
            </span>
            <a className='contact__link' href="https://wa.me/5516997212504">(16) 99721-2504</a>
          </div>
          <div className='contact'>
            <span className='contact__icon'>
              <Email />
            </span>
            <a className='contact__link' href="mailto:contato@mjbferreira.com">contato@mjbeferreira.com</a>
          </div>
          <p>&copy; {new Date().getFullYear()} matheus josé bento ferreira. Todos os direitos reservados.</p>
        </footer>
      </ThemeContext>
    </LangContext>
  )
}

export default App
