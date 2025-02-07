import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registro } from "../services/auth.service";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    try {
      setLoading(true);
      await registro(name, email, password, company);
      alert("Registro exitoso. Por favor, inicia sesión.");
      navigate("/login");
    } catch (error) {
      alert(`Error al registrarse: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Registro
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Empresa</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-green-500 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
