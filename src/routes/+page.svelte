<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<script>
	import Form from './Components/Form.svelte';
	import ContactCard from './UI/ContactCard.svelte';
	import SearchBox from './Components/SearchBox.svelte';
	import { apiData, patientsInfo, deletePatient, modal } from './Components/store.js';
	import { Modal, getModalStore } from '@skeletonlabs/skeleton';
	import { formVisible, searchParam } from './Components/store.js';
	import { initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();
	// import axious from 'axios';
	console.log($searchParam);
	let patientInfo = {
		patient_id: '',
		givenName: '',
		familyName: '',
		gender: '',
		dob: '',
		phoneNumber: ''
	};
	let page = 0;
	export async function fetchData(page, searchParam) {
		// fetch('https://lforms-fhir.nlm.nih.gov/baseR4/Patient?_id=5770912,pat-232')
		fetch(
			`https://lforms-fhir.nlm.nih.gov/baseR4/Patient?_count=10&_offset=${page * 10}${searchParam}`
		)
			// fetch('https://lforms-fhir.nlm.nih.gov/baseR4/Patient?active=false&_total=accurate&_count=10')
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				apiData.set(data);
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	}

	function updatePatient(event) {
		patientInfo = event.detail;
	}

	let showModal = false;
	let modalMessage = '';

	const modalStore = getModalStore();


	function deleteHandler(patient) {
		
		new Promise((resolve) => {
			const modalDelete = {
				type: 'confirm',
				title: 'Please Confirm',
				body: `Are you sure you wish to delete ID: ${patient.id}, ${patient.givenName} ${patient.familyName}?`,
				response: (r) => {
					resolve(r);
				}
			};
			modalStore.trigger(modalDelete);
		}).then((r) => {
			console.log('resolved response:', r);
			// Call your async function here and pass both parameters
			deleteP(patient, r);
		});
	}

	async function deleteP(patient, deleteResponse) {
		if (
			// confirm('Are you sure you want to delete this patient?')
			// confirmDelete()
			deleteResponse
		) {
			console.log('hello' + deleteResponse);
			const { error, diagnostics } = await deletePatient(patient.id);
			console.log(error);
			if (error) {
				showModal = true;
				modalMessage = diagnostics;
				// $modal.body = modalMessage;
				const modal = {
					type: 'alert',
					// Data
					title: 'Unable to Delete Patient',
					body: modalMessage
				};

				modalStore.trigger(modal);
				// await fetchData(page,$searchParam);
			} else {
				showModal = true;
				modalMessage = `Patient ID: ${patient.id}, ${patient.givenName} ${patient.familyName}  deleted successfully`;
				const modal = {
					type: 'alert',
					title: `Patient Deleted Successfully`,
					body: modalMessage
				};

				modalStore.trigger(modal);
				// await fetchData(page,$searchParam);
				// $modal.body = modalMessage;
				// modalStore.trigger($modal);
			}
		} else {
			modalStore.close();
		}
		await fetchData(page, $searchParam);
	}

	// function closeModal() {
	// 	showModal = false;
	// 	modalMessage = '';
	// }

	// function showMeModal() {
	// 	modalStore.trigger(modal);
	// }

	// let formVisible = false;
	// function toggleForm() {
	// 	$formVisible = true;
	// }
</script>

<Modal />
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">Patient Management App</h1>

		{#if $formVisible}
			<div><Form PatientInfo={patientInfo} /></div>
		{:else}
			<button
				class="btn variant-filled-primary"
				on:click={() => {
					$formVisible = true;
				}}>Create New Patient</button
			>
			<SearchBox />
			<main>
				<h1>Patient Information</h1>
				{#await fetchData(page, $searchParam)}
					<!-- {#await $patientsInfo} -->
					<p>Loading...</p>
				{:then}
					{#if $patientsInfo.length !== 0}
						{#each $patientsInfo as patient}
							<ContactCard
								patient_id={patient.id}
								givenName={patient.givenName}
								familyName={patient.familyName}
								gender={patient.gender}
								dob={patient.birthDate}
								phoneNumber={patient.phoneNumbers[0].value}
								on:editpatient={updatePatient}
								on:deletepatient={() => {
									deleteHandler(patient);
								}}
							/>
						{/each}
					{:else}
						<p>No patients found</p>
					{/if}
				{/await}
			</main>
			<div class="my-3 content-center justify-center items-center">
				<button class="btn variant-filled-primary" on:click={() => page--} disabled={page == 0}
					>Prev</button
				>
				<button class="btn variant-filled-primary" on:click={() => page++}>Next</button>
			</div>
		{/if}
	</div>
</div>
