import React, { useState } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const Form = ({ setOrigin, setDestination, setStop, distance, setDirectionsResponse }) => {
    const [stops, setStops] = useState([]);

    const {
        ready: originReady,
        value: originValue,
        suggestions: { status: originStatus, data: originData },
        setValue: setOriginValue,
        clearSuggestions: clearOriginSuggestions,
    } = usePlacesAutocomplete();

    const {
        ready: destinationReady,
        value: destinationValue,
        suggestions: { status: destinationStatus, data: destinationData },
        setValue: setDestinationValue,
        clearSuggestions: clearDestinationSuggestions,
    } = usePlacesAutocomplete();

    const {
        ready: stopReady,
        value: stopValue,
        suggestions: { status: stopStatus, data: stopData },
        setValue: setStopValue,
        clearSuggestions: clearStopSuggestions,
    } = usePlacesAutocomplete();

    const addressToCoordinates = async (address) => {
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            return { lat, lng };
        } catch (error) {
            console.log(error);
        }
    }

    const handleOriginSelect = async (address) => {
        setOriginValue(address, false);
        clearOriginSuggestions();
        const coordinates = await addressToCoordinates(address);
        setOrigin(coordinates);
    };

    const handleDestinationSelect = async (address) => {
        setDestinationValue(address, false);
        clearDestinationSuggestions();
        const coordinates = await addressToCoordinates(address);
        setDestination(coordinates);
    };

    const handleStopSelect = async (address) => {
        setStopValue(address, false);
        clearStopSuggestions();
        const coordinates = await addressToCoordinates(address);

        setStop((prev) => [...prev, {
            location: coordinates,
            stopover: true,
        }]);
        setStops((prev) => [...prev, {
            location: coordinates,
            stopover: true,
            description: address,
        }]);
        setStopValue('');
    };

    const handleDeleteStop = (index) => {
        const newStops = stops.filter((_, i) => i !== index);
        setStops(newStops);
        setStop(newStops);
    };

    return (
        <div className='px-4 md:mx-5 md:w-3/4'>
            <form className='flex flex-col'>

                <div className='relative flex flex-col'>
                    <label className='text-slate-600 mt-4 mb-1'>Origin</label>
                    <input
                        type="text"
                        value={originValue}
                        onChange={(e) => setOriginValue(e.target.value)}
                        disabled={!originReady}
                        placeholder="Origin"
                        className='rounded border focus:outline-none border-slate-200 text-black px-4 py-1 text-md w-4/5 md:w-3/4 h-12'
                    />
                    {originStatus === 'OK' && (
                        <ul className='bg-white rounded p-2 divide-y cursor-pointer select-none absolute z-10 top-24 border'>
                            {originData.map(({ place_id, description }) => (
                                <li key={place_id} onClick={() => handleOriginSelect(description)}>
                                    {description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className='relative flex flex-col'>
                    <label className='text-slate-600 mt-4 mb-1'>Stop</label>
                    <input
                        type="text"
                        value={stopValue}
                        onChange={(e) => setStopValue(e.target.value)}
                        disabled={!stopReady}
                        placeholder="Add Stops"
                        className='rounded border focus:outline-none border-slate-200 text-black px-4 py-1 text-md w-4/5 md:w-3/4 h-12'
                    />
                    {stopStatus === 'OK' && (
                        <ul className='bg-white rounded p-2 divide-y cursor-pointer select-none absolute z-10 top-24 border'>
                            {stopData.map(({ place_id, description }) => (
                                <li key={place_id} onClick={() => handleStopSelect(description)}>
                                    {description}
                                </li>
                            ))}
                        </ul>
                    )}

                </div>


                <ul className=' '>
                    {stops.map((stop, index) => (
                        <li
                            key={index}
                            className='flex items-center justify-between bg-white rounded border focus:outline-none border-slate-200 text-black px-4 py-1 text-md w-4/5 md:w-3/4 h-8 my-1 '
                        >
                            {stop.description}
                            <button
                                type="button"
                                onClick={() => handleDeleteStop(index)}
                                className='text-red-500 ml-4'
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>


                <div className='relative flex flex-col'>
                    <label className='text-slate-600 mt-4 mb-1'>Destination</label>
                    <input
                        type="text"
                        value={destinationValue}
                        onChange={(e) => setDestinationValue(e.target.value)}
                        disabled={!destinationReady}
                        placeholder="Destination"
                        className='rounded border focus:outline-none border-slate-200 text-black px-4 py-1 text-md w-4/5 md:w-3/4 h-12'
                    />
                    {destinationStatus === 'OK' && (
                        <ul className='bg-white rounded p-2 divide-y cursor-pointer select-none absolute z-10 top-24 border'>
                            {destinationData.map(({ place_id, description }) => (
                                <li key={place_id} onClick={() => handleDestinationSelect(description)}>
                                    {description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button type="button" onClick={() => setDirectionsResponse(null)} className='bg-blue-800 w-28 my-4 text-white rounded-3xl p-3 text-md'>Calculate</button>
            </form>
            <DistanceDisplay
                distance={distance}
                originValue={originValue}
                destinationValue={destinationValue}
            />
        </div>
    );
}

const DistanceDisplay = ({ distance, originValue, destinationValue }) => {
    return (
        <div className='py-4'>
            {distance && (
                <div>
                    <span className='bg-white flex rounded  items-center justify-between h-16 w-4/5 p-4 font-bold'>
                        <h1>Distance:</h1>
                        <h1 className='text-blue-700 text-2xl'>{distance} kms</h1>
                    </span>
                    <p className='mt-10 font-light'>
                        The distance between <b>{originValue.split(',')[0] || originValue}</b> and <b>{destinationValue.split(',')[0] || destinationValue}</b> via the selected route is <b>{distance} kms</b>.
                    </p>
                </div>
            )}
        </div>
    );
}

export default Form;
