'use client'

import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import styles from '../app/page.module.css'
import { Button } from 'primereact/button';
import 'leaflet/dist/leaflet.css'
import dynamic from "next/dynamic";
import * as turf from '@turf/turf';

import "../firebase"
import { db } from "../firebase"

import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from "firebase/firestore"

const Maps = dynamic(() => import('../components/Map/Map'), {
  ssr: false
})

export default function Home() {

  const [allPoligon, setAllPoligon] = useState([])
  const [arrayPoligonNew, setArrayPoligonNew] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [saveNewField, setSaveNewField] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(allPoligon);
  const [nameProperty, setNameProperty] = useState('');
  const [locationName, setLocationName] = useState('');
  const [sizeLocation, setSizeLocation] = useState('');
  const [selectedPoligon, setSelectedpoligon] = useState('lime');
  const [btnSelectCard, setBtnSelectCard] = useState(false);
  const [cardSelect, setCardSelecte] = useState(null);
  const [zoomValue, setZoomValue] = useState(5)

  useEffect(() => {
    getListCoordinates();
  }, []);

  const getListCoordinates = async () => {
    try {
      let query = await getDocs(collection(db, "Ubicaciones"))
      let data = query.docs.map((doc) => ({ ...doc.data(), idCollection: doc.id }))
      const transformedData = data.map(item => ({
        ...item,
        location: item.location.map(coord => [
          coord.latitud,
          coord.longitud
        ])
      }));
      setAllPoligon(transformedData)
      setFilteredLocations(transformedData)
      setDataCopy(transformedData)
    } catch (error) {
      console.log(error)
    }
  }

  const updateArrayPoligon = (newArray) => {
    setArrayPoligonNew(newArray);
  };

  const updateZoom = (zoom) => {
    setZoomValue(zoom);
  };

  const addPoligon = async () => {
    let _poligon = [...allPoligon]

    const subcoleccionCoordenadas = arrayPoligonNew.map(parCoordenadas => {
      const [latitud, longitud] = parCoordenadas;
      return { latitud, longitud };
    });

    let response = await addDoc(collection(db, "Ubicaciones"), { id: generateId(), name: nameProperty, sizeLocation: sizeLocation, subName: locationName, zoom: zoomValue, location: subcoleccionCoordenadas })

    _poligon.push({ id: generateId(), idCollection: response.id, name: nameProperty, sizeLocation: sizeLocation, subName: locationName,  zoom: zoomValue, location: [arrayPoligonNew] })
    setAllPoligon(_poligon)
    setFilteredLocations(_poligon)
    setArrayPoligonNew([])
    updateArrayPoligon([])
    setNameProperty('')
    setLocationName('')
    setSizeLocation('')
    setSaveNewField(false)
  }

  const generateId = () => {
    const timestamp = new Date().getTime();
    const randomSuffix = Math.floor(Math.random() * 10000);
    const uniqueId = `${timestamp}-${randomSuffix}`;
    return uniqueId;
  }

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setFilteredLocations([...dataCopy]);
      return
    }
    const _filteredLocations = filteredLocations.filter((location) => {
      return (
        location.name.toLowerCase().includes(value.toLowerCase()) ||
        location.subName.toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredLocations(_filteredLocations);
  };

  const onSelectedCard = (card) => {
    setCardSelecte(card)
    setAllPoligon([card])
    setZoomValue(card.zoom);
    setSelectedpoligon("red")
    setBtnSelectCard(true)
  }

  const onCancelSelected = () => {
    setAllPoligon([...dataCopy])
    setCardSelecte(null)
    setSelectedpoligon("lime")
    setBtnSelectCard(false)
  }

  const deleteCard = async (card) => {
    const prodcutsDel = doc(db, "Ubicaciones", card.idCollection)
    await deleteDoc(prodcutsDel)
    getListCoordinates();
  }

  const handleDeleteLocation = (index) => {
    const updatedLocations = [...arrayPoligonNew];
    updatedLocations.splice(index, 1);
    setArrayPoligonNew(updatedLocations);
    updateArrayPoligon(updatedLocations)
  };

  const handleCancelLocation = () => {
    setArrayPoligonNew([]);
    updateArrayPoligon([])
    setNameProperty('')
    setLocationName('')
    setSizeLocation('')
    setSaveNewField(false)
  }

  const editCard = (card) => {
    let idLocation = filteredLocations?.filter(item => item.id === card.id)
    setNameProperty(idLocation[0].name)
    setLocationName(idLocation[0].subName)
    setArrayPoligonNew(idLocation[0].location[0]);
    updateArrayPoligon(idLocation[0].location[0])
    setSaveNewField(true)
  }

  return (
    <main className={styles.body}>
      <div className={styles.sidebar}>
        {saveNewField ? (
          <>
            <h3>Agregar predio</h3>
            <div className='mb-2'>Selecciona los puntos en el mapa*</div>
            <div className='flex flex-column gap-1 mb-2'>
              <label htmlFor="username">Nombre</label>
              <InputText placeholder='Nombre del predio' value={nameProperty} onChange={(e) => setNameProperty(e.target.value)} />
            </div>
            <div className='flex flex-column gap-1 mb-2'>
              <label htmlFor="username">Lugar</label>
              <InputText placeholder='Lugar del predio' value={locationName} onChange={(e) => setLocationName(e.target.value)} />
            </div>
            <div className='flex flex-column gap-1 mb-2'>
              <label htmlFor="username">Tamaño en Hectarias</label>
              <InputText placeholder='Tamaño' value={sizeLocation} onChange={(e) => setSizeLocation(e.target.value)} />
            </div>
            <div>
              <h4>Coordenadas</h4>
              {arrayPoligonNew?.map((location, index) => {
                return (
                  <div key={index} className='flex wrap gap-1 mb-1 col-12'>

                    <InputText value={location[0]} disabled className='col-5'/>
                    <InputText value={location[1]} disabled className='col5'/>

                    <Button icon="pi pi-trash" className='col-1' onClick={() => handleDeleteLocation(index)} />
                  </div>
                )
              })}
            </div>
            <div className='flex nowrap md:wrap gap-1 my-3 justify-content-center'>
              <Button icon="pi pi-check" label='Guardar' onClick={() => addPoligon()} />
              <Button icon="pi pi-times" label='Cancelar' onClick={() => handleCancelLocation()} />
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="p-input-icon-left p-fluid flex">
                <i className="pi pi-search" />
                <InputText placeholder="Search" onChange={handleFilterChange} />
              </span>
            </div>
            <div className='p-fluid mt-2 mb-4'>
              <Button label="New field" icon="pi pi-plus-circle" onClick={() => setSaveNewField(true)} />
            </div>
            <div>
              {filteredLocations?.map((card, id) => {
                return (
                  <div key={id} className={card.idCollection === cardSelect?.idCollection ? "bg-green-300 flex wrap align-items-center p-fluid justify-content-between p-card my-1 p-2 p-card md:wrap" : "flex nowrap align-items-center p-fluid justify-content-between p-card my-1 p-2 p-card md:wrap"} >
                    <div className='cursor-pointer nowrap flex align-items-center p-fluid w-full' onClick={() => onSelectedCard(card)}>
                      <i className="pi pi-map-marker ml-2 mr-3" style={{ fontSize: '1.5rem' }}></i>
                      <div className='mr-auto'>
                        <h3 className='my-1'>{card.name}</h3>
                        <span>{card.subName} - {card?.sizeLocation} hectareas</span>
                      </div>
                    </div>

                    <div className='flex gap-1'>
                      <Button icon="pi pi-trash" onClick={() => deleteCard(card)} />
                    </div>
                  </div>
                )
              })}
            </div>
            {btnSelectCard ?
              <div className='mt-4'>
                <Button label='Deseleccionar' onClick={() => onCancelSelected()} />
              </div>
              : null}

          </>)}
      </div>
      <div className={styles.content}>
        <Maps updateArrayPoligon={updateArrayPoligon} zoomValue={zoomValue} zoom={updateZoom} newPoligon={arrayPoligonNew} allData={allPoligon} selectedPoints={saveNewField} color={selectedPoligon} />
      </div>
    </main>
  )
}
