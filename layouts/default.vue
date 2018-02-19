<template>
  <div>
    <header class="Header">
      <div class="container">
        <h1 class="Header__Title">spotify-library-janitor</h1>
        <nav class="Header__Menu">
          <nuxt-link class="Header__Link" :to="$i18n.path('')" exact>
            {{ $t('links.home') }}
          </nuxt-link>
          <nuxt-link  class="Header__Link" :to="$i18n.path('musiclist')" exact>
            {{ $t('links.musiclist') }}
          </nuxt-link>
          <nuxt-link  class="Header__Link" v-if="$i18n.locale === 'en'" :to="($route.fullPath.indexOf('#')>-1)?`/nl`:`/nl`+$route.fullPath" active-class="none" exact>
            {{ $t('links.dutch') }}
          </nuxt-link>
          <nuxt-link  class="Header__Link" v-else :to="$route.fullPath.replace(/^\/[^\/]+/, '')" active-class="none" exact>
            {{ $t('links.english') }}
          </nuxt-link>
        </nav>

      </div>
    </header>
    <nuxt/>
  </div>
</template>

<script>

    import Vue from 'vue'

export default {
    head() {

        return { title: this.$t('home.title') }
    }

}
</script>

