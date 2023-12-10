<template>
  <Tooltip class="ms-1" position="bottom" tooltip-class="min-w-[18rem]">
    <p class="mb-2">
      Le nom d'utilisateur doit être formaté de cette manière:
    </p>
    <ul class="list-disc ms-5">
      <li>Entre 3 et 18 caractères</li>
      <li>Uniquement des lettres de A à Z, des chiffres et les caracères spéciaux trait d'union (-), trait du bas (_) & point (.)</li>
      <li>Au moins une lettre</li>
      <li>Ne peut pas commencer pas un caractère spécial</li>
      <li>Ne peut pas se terminer pas un point (.)</li>
      <li>Les caractères spéciaux ne peuvent pas s'enchainer</li>
    </ul>
  </Tooltip>
</template>
