import React from 'react';
import Header from '../../insights/Header';
import Main from '../../insights/Main';
import Footer from '../../insights/Footer';
import './Options.css';

interface Props {
  title: string;
}



const Options: React.FC<Props> = ({ title }: Props) => {
  return <>
    <Header />
    <Main />
    <Footer />
  </>
};

export default Options;
