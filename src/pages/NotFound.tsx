
import React from "react";
import { Link } from "react-router-dom";
import ZeAssistantIcon from "../components/ZeAssistantIcon";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <ZeAssistantIcon className="mb-6" />
      
      <h1 className="text-3xl font-bold text-zeagro-green mb-2">Oops!</h1>
      <p className="text-lg mb-6">A página que você está procurando não foi encontrada.</p>
      
      <Link 
        to="/home" 
        className="btn-primary"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default NotFound;
