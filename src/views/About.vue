<template>
  <main class="flex-grow pt-20">
    <!-- HeroSection con padding para navbar fixed -->
    <div class="flex flex-col w-full pt-20">
      <div class="w-full">
        <div class="@container">
          <div class="w-full">
            <div 
              class="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-4 relative" 
              style='background-image: linear-gradient(rgba(24, 17, 17, 0.3) 0%, rgba(24, 17, 17, 1) 100%), url("/images/backgrounds/About_Hero.webp");'
            >

              <div class="flex flex-col gap-2 text-center max-w-[800px] z-10">
                <h1 class="text-white text-5xl md:text-7xl leading-tight tracking-wide" style="font-family: 'Cinzel Decorative', serif; font-weight: 700;">
                  Somos Gienco
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="flex flex-col items-center w-full bg-background-dark py-10">
      <div class="w-full max-w-[960px] px-4 md:px-0">
        <!-- Our Story Header -->
        <div class="flex flex-col gap-2">
          <h2 class="text-white text-3xl font-bold leading-tight tracking-[-0.015em] pb-3 pt-5 border-l-4 border-primary pl-4">La Historia</h2>
        </div>
        
        <!-- Body Text -->
        <div class="flex flex-col md:flex-row gap-8 py-6">
          <div class="flex-1">
            <p class="text-gray-300 text-lg font-normal leading-relaxed">
              La banda se forma en Agosto 2021 cuando Itai (Batería), Elías (Bajo y violín) y Joan (Guitarra y voz) deciden llevar a cabo el proyecto musical, siempre con la idea de componer canciones propias, pasan por varias formaciones hasta que en 2023 se une Norat y el grupo cierra así lo que es su formación actual.
            </p>
          </div>
          <div class="flex-1">
            <p class="text-gray-400 text-base font-normal leading-relaxed">
              Rock n' Roll desde nuestros corazones.
            </p>
            <p class="text-gray-400 text-base font-normal leading-relaxed mt-4">
              Somos un grupo de cuatro jóvenes a los que les apasiona la música, en nuestro repertorio encontrarás mucha variedad de estilos, así como versiones y temas propios. Sobre el escenario ofrecemos un directo muy enérgico y auténtico.
            </p>
            <p class="text-gray-400 text-base font-normal leading-relaxed mt-4">
              ¡Que no te lo cuenten!
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import Footer from '../components/Footer.vue'
</script>
