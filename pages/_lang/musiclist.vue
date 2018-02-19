<template>
  <div class="Content">
    <div class="container">
      <h1 class="Content__Title">{{ $t('musiclist.title') }}</h1>
      <p>{{ $t('musiclist.introduction') }}</p>

        <!-- this component will only be rendered on client-side -->
        <p><form id="search">
          Search <input name="query" v-model="searchQuery">
      </form>
        <musiclist_component id="grid-template" :data="gridData" :columns="gridColumns" :filter-key="searchQuery">
        </musiclist_component>
    </div>


  </div>


</template>



<script>
  import Vue from 'vue'

  import musiclist_component from '~/components/musiclist_component'
  export default {
  head() {

      return {title: this.$t('musiclist.title')}
  },
      data(){

     Vue.authorization()
        //  let gridData=Vue.getMusicLibrary()


          return {
      isLoggedIn: Vue.isAuthorized(),
      searchQuery: '',
      gridColumns: ['id','name'],
      gridData: []
     }
  },
  components: {
      musiclist_component
  }



}
</script>
