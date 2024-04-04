<script>
	import { searchParam } from './store';
	let searchQuery = '';

	function hasNumber(myString) {
		return /\d/.test(myString);
	}

	$: if (hasNumber(searchQuery)) {
		searchParam.set('&phone=' + searchQuery);
		console.log(searchParam);
	} else {
		searchParam.set('&name=' + searchQuery);
		console.log(searchParam);
	}
</script>

<div>
	<input
		class="input w-90"
		type="text"
		bind:value={searchQuery}
		placeholder="Search patients by name and phone number(exact)"
	/>
	<!-- <button class="btn variant-filled-primary" on:click={()=>{$searchParam='&name='+searchQuery;console.log($searchParam)}}>Search</button> -->
</div>
