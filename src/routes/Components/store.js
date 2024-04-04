import { writable, derived } from 'svelte/store';
import fetchData from '../+page.svelte';
// const modalStore = getModalStore();
// import { getModalStore } from '@skeletonlabs/skeleton';
			
// const modalStore = getModalStore();

export const refreshFlag = writable(false);

export const formVisible = writable(false);

export const apiData = writable([]);


export function refreshOn() {
  refreshFlag.set(true);
}

export function refreshOff() {
  refreshFlag.set(false);
}

export const patientsInfo = derived(apiData, ($apiData) => {
  if ($apiData.entry) {
    return $apiData.entry.map(entry => {
      const patient = entry.resource;
      const phoneNumbers = patient.telecom
        ? patient.telecom.filter(contact => contact.system === 'phone')
        : [{value:'no phone number'}];
 
      return {
        id: patient.id,
        givenName: patient.name[0].given[0] || '',
        familyName: patient.name[0].family || '',
        gender: patient.gender || '',
        birthDate: patient.birthDate,
        phoneNumbers: phoneNumbers.map(contact => ({
          value: contact.value
        }))
      };
    });
  }
  return [];
});

export const patientData = writable({});
export async function updatePatient(patientId, updatedData) {
    try {
      const response = await fetch(`https://lforms-fhir.nlm.nih.gov/baseR4/Patient/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/fhir+json',
          // Add any additional headers required by your FHIR server
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const updatedPatient = await response.json();
      patientData.set(updatedPatient);
      
    } catch (error) {
      console.error('Error updating patient:', error);
    }
    
  }

  export async function addPatient(updatedData) {
    try {
      const response = await fetch(`https://lforms-fhir.nlm.nih.gov/baseR4/Patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/fhir+json',
          // Add any additional headers required by your FHIR server
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const updatedPatient = await response.json();
      patientData.set(updatedPatient);

      

    } catch (error) {
      console.error('Error updating patient:', error);
    }
    
  }
  
export const deletedPatient = writable({});
export async function deletePatient(patientId) {
    try {
      console.log(`delete ${patientId}`);
      const response = await fetch(`https://lforms-fhir.nlm.nih.gov/baseR4/Patient/${patientId}`, {
        method: 'DELETE',
        headers: {
          // Add any headers required by your FHIR server
        },
      });
  
      if (!response.ok) {
        const error = await response.json();
        const diagnostics = error.issue && error.issue.length > 0 ? error.issue[0].diagnostics : 'Unknown error';
        // modalStore.trigger($modal);
        return { error: true, diagnostics };
        // throw new Error(`HTTP error ${response.status}: ${diagnostics}`);
        
      }
      else {
        return { error: false };
      }
  
      // Remove the deleted patient from the patients store
      // const updatedPatients = $patients.filter(patient => patient.id !== patientId);
      // patients.set(updatedPatients);
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  } 

  export const modal = writable({
    type: 'alert',
    // Data
    title: 'Example Alert',
    body: 'This is an example modal.',
    image: 'https://i.imgur.com/WOgTG96.gif',
  });

  export const searchParam = writable('');