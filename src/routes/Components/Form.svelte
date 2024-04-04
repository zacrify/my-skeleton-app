<script>

	import { updatePatient, addPatient } from './store';
	import { getModalStore } from '@skeletonlabs/skeleton';
  import { formVisible } from './store';
	export let PatientInfo;
	const modalStore = getModalStore();
  const todayDate = new Date().toISOString().split('T')[0];
	async function onSubmit(e) {
		e.preventDefault();

		const formData = new FormData(e.target);
	
		const data = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		const patient = {
			resourceType: 'Patient',
			id: data.patient_id,
			name: [
				{
					given: [data.givenName],
					family: data.familyName
				}
			],
      gender: data.gender,
			birthDate: data.dob,
			telecom: [
				{
					system: 'phone',
					value: data.tel
				}
			]
		};
		if (patient.id) {
		await updatePatient(patient.id, patient);
    const modal= {
					type: 'alert',
					// Data
					title: 'Patient Updated Successfully',
					body: `Patient ID: ${patient.id}, ${patient.name[0].given} ${patient.name[0].family} updated successfully`
				};
				
				modalStore.trigger(modal);
    console.log(patient);
    $formVisible = false;
    } else {
    await addPatient(patient);
    // const modal= {
		// 			type: 'alert',
		// 			// Data
		// 			title: 'Patient Added Successfully',
		// 			body: `Patient ID: ${patient.id}, ${patient.name[0].given} ${patient.name[0].family} added successfully`
		// 		};
				
		// 		modalStore.trigger(modal);
    console.log(patient);
    $formVisible = false;
    }
    
    
		e.target.reset();
	}
</script>

<form on:submit|preventDefault={onSubmit} class="shadow-md rounded px-8 pt-6 pb-8 mb-4">
	<div class="form-control">
		<label class="block text-white-700 text-sm font-bold mb-2" for="patient_id">ID</label>
		<input
			class="shadow appearance-none border rounded w-200 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			type="text"
			id="patient_id"
			name="patient_id"
			value={PatientInfo.patient_id}
			readonly
		/>
	</div>
	<div class="form-control">
		<label class="block text-white-700 text-sm font-bold mb-2" for="givenName">Given Name</label>
		<input
			class="shadow appearance-none border rounded w-200 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			type="text"
			id="givenName"
			name="givenName"
			value={PatientInfo.givenName}
      required
		/>
	</div>
	<div class="form-control">
		<label class="block text-white-700 text-sm font-bold mb-2" for="familyName">Family Name</label>
		<input
			class="shadow appearance-none border rounded w-200 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			type="text"
			id="familyName"
			name="familyName"
			value={PatientInfo.familyName}
		/>
	</div>
  <div>
		<label class="block text-white-700 text-sm font-bold my-2" for="gender">Gender</label>
    <select id="gender" name="gender" value={PatientInfo.gender} 	class="shadow appearance-none border rounded w-200 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    required
    >
      <option value="noselect" disabled>Please Select</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
	</div>
	<div>
		<label class="block text-white-700 text-sm font-bold my-2" for="dob">DOB</label>
		<input
			class="shadow appearance-none border rounded w-200 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			type="date"
			id="dob"
			name="dob"
			value={PatientInfo.dob}
      max={todayDate}
		/>
    <p>Year:{PatientInfo.dob}</p>
	</div>
	<div>
		<label class="block text-white-700 text-sm font-bold my-2" for="tel">Tel</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			type="text"
			id="tel"
			name="tel"
			value={PatientInfo.phoneNumber=='no phone number'? '':PatientInfo.phoneNumber}
      required
		/>
	</div>
	<div class="card-footer my-5">
		<button type="submit" class="btn variant-ringed-primary"> Enter </button>
    <button type="button" class="btn variant-ringed-primary" on:click={()=>{$formVisible = false}}>Back</button>
	</div>
</form>
