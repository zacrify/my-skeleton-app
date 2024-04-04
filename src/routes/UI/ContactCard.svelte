<script>
	import { Avatar } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import { formVisible } from '../Components/store';
	export let patient_id;
	export let givenName;
	export let familyName;
  export let gender;
	export let dob;
	export let phoneNumber = [{ value: 'No phone number available' }];

	const dispatch = createEventDispatcher();

	let editingPatient = null;
	let editingPatientData = {};
</script>

<div class="card p-4 m-2 place-content-center">
	<div class="class-header p-4">
		<!-- <Avatar src={image} width="w-32" rounded="rounded-full" /> -->
		<!-- <img src={image} alt="Profile Picture"> -->
		<h1>Name: {givenName} {familyName}</h1>
	</div>

	<div class="place-content-center">
		<h1>ID: {patient_id}</h1>
    <h2>Gender: {gender}</h2>
		<h2>DOB: {dob}</h2>
		<h2>Tel: {phoneNumber}</h2>
	</div>
	<!-- <div class="class-footer p-4">
      <p>{description}</p>
    </div> -->
	<div class="class-footer p-4">
		<button
			class="btn variant-ringed-primary"
			on:click={() => {
				dispatch('editpatient', { patient_id, givenName, familyName, gender, dob, phoneNumber });
        $formVisible = true;
        console.log('formVisible');
        
			}}>Edit</button
		>
		<button
			class="btn variant-ringed-primary"
			on:click={() => dispatch('deletepatient', { patient_id })}>Delete</button
		>
	</div>
</div>
