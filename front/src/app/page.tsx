'use client';
import { useEffect, useState } from 'react';
import { Reservation } from './types/Reservation';
import ReservationItem from './components/ReservationItem';
import SearchBar from './components/SearchBar';
import ReservationForm from './components/ReservationForm';
import useReservations from './hooks/useReservations';
import { Actions } from './enums/ActionsEnum';
import Link from 'next/link';

export default function Home() {
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();
  const { fetchReservations, createReservation, updateReservation, deleteReservation, reservations } =
    useReservations();

  const [showForm, setShowForm] = useState<Boolean>(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    setFilteredReservations(reservations);
  }, [reservations]);

  const onAction = (action: Actions, reservation: Reservation) => {
    switch (action) {
      case Actions.SHOWFORM:
        setSelectedReservation(reservation);
        setShowForm(true);
        break;
      case Actions.CREATE:
        createReservation(reservation);
        break;
      case Actions.EDIT:
        updateReservation(reservation);
        break;
      case Actions.DELETE:
        deleteReservation(reservation.id!);
        break;
      default:
        break;
    }
  };

  const onSearch = (searchTerm: string) => {
    const filteredReservations = reservations.filter(reservation =>
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReservations(filteredReservations);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 min-h-screen bg-white shadow-lg rounded-lg pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 sm:text-left">Lista de Reservas</h1>
        <Link href="/csv-upload" passHref>
          <button className="bg-green-500 mt-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Subir CSV
          </button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="w-full md:max-w-xs">
          <SearchBar onSearch={onSearch} />
        </div>
        <button
          onClick={() => {
            setSelectedReservation(undefined);
            setShowForm(!showForm);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear Reserva
        </button>
      </div>
      {showForm && (
        <ReservationForm
          reservationToEdit={selectedReservation}
          onSubmit={onAction}
          onClose={() => setShowForm(false)}
        />
      )}
      <div className="overflow-x-auto mt-6">
        <div className="max-h-[65vh] md:max-h-[75vh] overflow-y-auto">
          <table className="min-w-full table-auto text-gray-400 bg-gray-800 rounded-lg">
            <thead className="text-xs text-white uppercase bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-center">Codigo</th>
                <th className="px-6 py-3 text-center">Nombre Completo</th>
                <th className="px-6 py-3 text-center">Email</th>
                <th className="px-6 py-3 text-center">Estado</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-600">
              {filteredReservations.map(reservation => (
                <ReservationItem key={reservation.code} reservation={reservation} onAction={onAction} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
