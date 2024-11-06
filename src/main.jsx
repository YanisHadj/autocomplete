import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Autocomplete from './Component/Autocomplete';
import './index.css';


const names = [
    { firstName: 'Alice', lastName: 'Dupont' },
    { firstName: 'Bob', lastName: 'Martin' },
    { firstName: 'Charlie', lastName: 'Lemoine' },
    { firstName: 'David', lastName: 'Bertin' },
    { firstName: 'Eva', lastName: 'Lambert' },
    { firstName: 'Fiona', lastName: 'Dufresne' },
    { firstName: 'George', lastName: 'Michel' },
    { firstName: 'Hannah', lastName: 'Leclerc' },
    { firstName: 'Isaac', lastName: 'Moreau' },
    { firstName: 'Jessica', lastName: 'Garcia' },
    { firstName: 'Kevin', lastName: 'Boyer' },
    { firstName: 'Laura', lastName: 'Petit' },
    { firstName: 'Michael', lastName: 'Lemoine' },
];


const getDataUser= async () => {
    let result = await fetch(`http://localhost:3000/user/1`, {
        method: "POST"
    });
    let data = await result.json();
    return data.data;
}

const getDataProduct= async () => {
    let result = await fetch(`http://localhost:3000/product/1`, {
        method: "POST"
    });
    let data = await result.json();
    return data.data;
}

const mixedData = async () => {
    let data = [...await getDataUser(), ...await getDataProduct()];
    data.sort((a, b) => {
        return a.label > b.label ? 1 : -1;
    });
    return data;
}


createRoot(document.getElementById('root')).render(
       <StrictMode>
        <div className="body">
            <h2 className='title'> 1. Autocomplete user simple avec data en props</h2>
            <Autocomplete items={names} isSuggestion={false}/>

            <h2 className='title'>2. Autocomplete User simple avec data en fonction</h2>
            <Autocomplete onGetDataUser={getDataUser}isSuggestion={false}/> 

            <h2 className='title'>3.Autocomplete User multiple avec data en fonction</h2>
            <Autocomplete onGetDataUser={getDataUser} isMultiSelect={true}isSuggestion={false}/>

            <h2 className='title'>4. Autocomplete Product simple avec data en fonction</h2>
            <Autocomplete onGetDataProduct={getDataProduct}/> 

            <h2 className='title'>5. Autocomplete Product simple avec data en fonctiont</h2>
            <Autocomplete onGetDataProduct={getDataProduct} isMultiSelect={true} isSuggestion={false}/> 

            <h2 className='title'>6.Autocomplete Mix multiple avec data en fonction</h2>
            <Autocomplete isMultiSelect={true} onMixedData={mixedData} isSuggestion={false}/>
            
            <h2 className='title'>7. Autocomplete Product multiple avec template et data en fonction</h2>
            <Autocomplete />  

            <h2 className='title'>8. Autocomplete Product simple avec suggestion au lieu d'une liste</h2>
            <Autocomplete onGetDataProduct={getDataProduct} isSuggestion={false} />  
        </div>
    </StrictMode>
);
