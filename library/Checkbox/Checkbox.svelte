<script>
  // From https://github.com/Perspective-Software/svelte-checkbox/blob/master/Checkbox.svelte
  import { createEventDispatcher, onMount } from "svelte"
  import { sineInOut } from "svelte/easing"
  import createStyle from "./createStyle.js"
  export let checkedControlled = false
  export let checked = false
  export let size = '3rem'
  export let name = ''
  export let id = ''
  export let primaryColor = '#1CAC78'
  export let secondaryColor = '#d8d8ea'
  export let duration = 700
  export let labelId = ''
  export let disabled = false

  let self,
    canChange = true,
    changeBg = false,
    borderStyle,
    checkStyle

  const dispatch = createEventDispatcher()

  const animationOptions = {
    to: 100,
    duration,
    easing: sineInOut,
    reverse: checked
  }

  const borderAnimation = createStyle({
    ...animationOptions,
    duration,
    css: {
      "stroke-dashoffset": {
        input: [0, 45, 75],
        output: [342, -150, -307],
        onComplete: () => (changeBg = true)
      },
      "stroke-dasharray": {
        input: [0, 45, 75],
        output: [342, 154, [0, 310]]
      },
      opacity: { input: [0, 5], output: [0, 1] }
    },
    onChange: style => (borderStyle = style),
    onEnd: () => (canChange = true)
  })

  const checkAnimation = createStyle({
    ...animationOptions,
    css: {
      "stroke-dashoffset": {
        input: [65, 100],
        output: [300, 144],
        beforeStart: () => (changeBg = false)
      },
      "stroke-dasharray": { input: [65, 100], output: [100, 84] }
    },
    onChange: style => (checkStyle = style)
  })

  const handleChange = () => {
    if (!canChange) return false
    if (checked) {
      borderAnimation.reverse()
      checkAnimation.reverse()
    } else {
      borderAnimation.play()
      checkAnimation.play()
    }
    canChange = false
    checked = !checked
    dispatch("change", checked)
  }

  const setProp = (prop, val) => self.style.setProperty(prop, val)
  onMount(() => {
    setProp("--checkbox-color-primary", primaryColor)
    setProp("--checkbox-color-secondary", secondaryColor)
  })

  const playAnimation = () => {
    if ( checkedControlled !== checked) {
      handleChange()
    }
  }

  $: checkedControlled, playAnimation()
</script>

<style>
  .checkbox {
    --checkbox-color-primary: #242432;
    --checkbox-color-secondary: #d8d8ea;
    --checkbox-border-width: 4%;
    --checkbox-border-width-active: 7%;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.5em;
    padding-bottom: 0.1em;
  }
  .checkbox input {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }
  .checkbox__svg {
    width: 100%;
    height: 100%;
  }
  .checkbox__check,
  .checkbox__border {
    stroke-width: var(--checkbox-border-width);
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .checkbox__border {
    width: calc(100% - (var(--checkbox-border-width) * 2));
    height: calc(100% - (var(--checkbox-border-width) * 2));
    transform: translate(
            calc(var(--checkbox-border-width) * -1),
            var(--checkbox-border-width)
    )
    rotate(90deg);
    stroke: var(--checkbox-color-secondary);
    transition: 0.2s;
    transform-origin: 50% 50%;
  }
  .checkbox__border.-active {
    stroke: var(--checkbox-color-primary);
    transition: none;
  }
  .checkbox:hover .checkbox__border,
  .checkbox.-checked .checkbox__border {
    --checkbox-border-width: var(--checkbox-border-width-active);
  }
  .checkbox.-changeBg .checkbox__border {
    stroke: var(--checkbox-color-primary);
  }
  .checkbox__check {
    --checkbox-border-width: var(--checkbox-border-width-active);
    stroke: var(--checkbox-color-primary);
  }
</style>

<div
  {id}
  bind:this={self}
  class="checkbox {$$props.class}"
  class:-changeBg={changeBg}
  class:-checked={checked || !canChange}
  style="width: {size};height: {size};">
  <input id={labelId} type="checkbox" on:change={handleChange} {name} {disabled}/>
  <svg class="checkbox__svg" preserveAspectRatio="none" viewBox="0 0 100 100">
    <rect class="checkbox__border" rx="15%" />
    <rect class="checkbox__border -active" style={borderStyle} rx="15%" />
    <path style={checkStyle} class="checkbox__check" d="M 89.5 13 L 46 71 L 28 54" />
  </svg>
</div>
