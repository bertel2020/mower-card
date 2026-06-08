
# Lawn Mower Card


> Lawn mower card for [Home Assistant][home-assistant] Lovelace UI

By default, Home Assistant does not provide any card for controlling robot lawn mowers. This card displays the state of your `lawn_mower` entity and allows you to control your robot.

![Preview of lawn-mower-card][preview-image]

## Installing

### HACS

This card is available in [HACS][hacs] (Home Assistant Community Store).

Just search for `Lawn Mower Card` in plugins tab.

### Manual

1. Download `mower-card.js` file from the [latest-release].
2. Put `mower-card.js` file into your `config/www` folder.
3. Add reference to `mower-card.js` in Lovelace. There's two way to do that:
   1. **Using UI:** _Configuration_ → _Lovelace Dashboards_ → _Resources Tab_ → Click Plus button → Set _Url_ as `/local/mower-card.js` → Set _Resource type_ as `JavaScript Module`.
      **Note:** If you do not see the Resources Tab, you will need to enable _Advanced Mode_ in your _User Profile_
   2. **Using YAML:** Add following code to `lovelace` section.

      ```yaml
      resources:
        - url: /local/mower-card.js
          type: module
      ```

4. Add `custom:lawn-mower-card` to Lovelace UI as any other card (using either editor or YAML configuration).

## Usage

This card can be configured using Lovelace UI editor.

1. In Lovelace UI, click 3 dots in top left corner.
2. Click _Configure UI_.
3. Click Plus button to add a new card.
4. Find _Custom: Lawn Mower Card_ in the list.
5. Choose `entity`.
6. Now you should see the preview of the card!

_Sorry, no support for `actions`, `shortcuts` and `stats` in visual config yet._

Typical example of using this card in YAML config would look like this:

```yaml
type: 'custom:lawn-mower-card'
entity: lawn_mower.garden_mower
actions:
  start_mowing:
    service: script.mow_front_lawn
    service_data:
      entity_id: lawn_mower.garden_mower
stats:
  default:
    - attribute: battery_level
      unit: '%'
      subtitle: Battery
    - attribute: total_mowing_time
      unit: hours
      subtitle: Mowing time
  mowing:
    - entity_id: sensor.garden_mower_area_left
      value_template: '{{ (value | float(0)) | round(1) }}'
      subtitle: Area left
      unit: m²
    - attribute: mowing_time
      unit: minutes
      subtitle: Mowing time
shortcuts:
  - name: Mow front lawn
    service: script.mow_front_lawn
    icon: 'mdi:grass'
  - name: Mow back lawn
    service: script.mow_back_lawn
    icon: 'mdi:grass'
  - name: Mow border
    service: script.mow_border
    icon: 'mdi:fence'
```

Here is what every option means:

| Name             |   Type    | Default      | Description                                                                                                |
| ---------------- | :-------: | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `type`           | `string`  | **Required** | `custom:lawn-mower-card`                                                                                   |
| `entity`         | `string`  | **Required** | An entity_id within the `lawn_mower` domain.                                                               |
| `battery_entity` | `string`  | Optional     | An entity_id within the `sensor` domain to display battery state and icon.                                 |
| `map`            | `string`  | Optional     | An entity_id within the `camera` domain, for streaming a live map of your garden/mowing progress.          |
| `map_refresh`    | `integer` | `5`          | Update interval for map camera in seconds                                                                  |
| `image`          | `string`  | `default`    | Path to image of your lawn mower. Better to have `png` or `svg`.                                           |
| `show_name`      | `boolean` | `true`       | Show friendly name of the mower.                                                                           |
| `show_status`    | `boolean` | `true`       | Show status of the mower.                                                                                  |
| `status_attribute` | `string` | Optional   | Name of an entity attribute to display as the status instead of the mower's activity (`entity.state`). Some integrations (e.g. Gardena/Husqvarna) expose extra attributes such as `state` (device health, e.g. `OK`) or `activity` (e.g. `PARKED_PARK_SELECTED`) — pick one here if you'd rather see that than the default mowing activity (e.g. `docked`). Selectable via a dropdown in the visual editor; leave empty to use the default. |
| `show_toolbar`   | `boolean` | `true`       | Show toolbar with actions.                                                                                 |
| `compact_view`   | `boolean` | `false`      | Compact view without image.                                                                                |
| `stats`          | `object`  | Optional     | Custom per state stats for your lawn mower                                                                 |
| `actions`        | `object`  | Optional     | Override default actions behavior with service invocations.                                                |
| `shortcuts`      |  `array`  | Optional     | List of shortcuts shown at the right bottom part of the card with custom actions for your lawn mower.      |
| `override`       | `object`  | Optional     | Adds a toolbar button that calls a service with a user-selectable duration (in hours), e.g. to temporarily override your mower's schedule. See [`override` object](#override-object) below. |

### `stats` object

You can use any attribute of the mower or even any entity by `entity_id` to display by stats section. You can also combine `attribute` with `entity_id` to extract an attribute value of specific entity:

| Name             |   Type   | Default  | Description                                                                                          |
| ---------------- | :------: | -------- | ---------------------------------------------------------------------------------------------------- |
| `entity_id`      | `string` | Optional | An entity_id with state, i.e. `sensor.garden_mower_battery`.                                        |
| `attribute`      | `string` | Optional | Attribute name of the stat, i.e. `battery_level`.                                                   |
| `value_template` | `string` | Optional | Jinja2 template returning a value. `value` variable represents the `entity_id` or `attribute` state. |
| `unit`           | `string` | Optional | Unit of measure, i.e. `hours`.                                                                       |
| `subtitle`       | `string` | Optional | Friendly name of the stat, i.e. `Battery`.                                                           |

### `actions` object

You can define service invocations to override default actions behavior. Available actions to override are `start_mowing`, `pause`, `resume` and `dock`.

| Name           |   Type   | Default  | Description                                       |
| -------------- | :------: | -------- | -------------------------------------------------- |
| `service`      | `string` | Optional | A service to call, i.e. `script.mow_front_lawn`.   |
| `service_data` | `object` | Optional | `service_data` for `service` call                  |

### `shortcuts` object

You can define [custom scripts][ha-scripts] for custom actions, e.g. mowing a specific zone, and add them to this card with the `shortcuts` option.

| Name           |   Type   | Default  | Description                                                             |
| -------------- | :------: | -------- | ----------------------------------------------------------------------- |
| `name`         | `string` | Optional | Friendly name of the action, i.e. `Mow front lawn`.                     |
| `service`      | `string` | Optional | A service to call, i.e. `script.mow_front_lawn`.                        |
| `target`       | `object` | Optional | A `HassServiceTarget`, to define a target for the current service call. |
| `icon`         | `string` | Optional | Any icon for action button.                                             |
| `service_data` | `object` | Optional | `service_data` for `service` call                                       |

### `override` object

Adds a button to the toolbar (next to your shortcuts) that opens a small menu of duration choices, in hours, and calls a service with the chosen duration — handy for integrations that support temporarily overriding the mower's schedule, such as Gardena's `gardena_smart_system.start_override`.

| Name                        |   Type   | Default      | Description                                                                                                                                  |
| --------------------------- | :------: | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                      | `string` | **Required** | Friendly name / tooltip of the button, i.e. `Start override`.                                                                                |
| `service`                   | `string` | **Required** | A service to call, i.e. `gardena_smart_system.start_override`.                                                                               |
| `durations`                 | `array`  | **Required** | Duration choices shown in the menu, in hours, i.e. `[1, 2, 3, 6]`.                                                                            |
| `icon`                      | `string` | `mdi:timer-play-outline` | Icon for the button.                                                                                                              |
| `target`                    | `object` | `{ entity_id: <card entity> }` | A `HassServiceTarget`, to define a target for the service call. Defaults to the card's `entity`.                                   |
| `service_data`              | `object` | Optional     | Additional static `service_data` merged into every call (alongside the duration).                                                            |
| `duration_attribute`        | `string` | `duration`   | Key used in `service_data` for the chosen duration value.                                                                                    |
| `duration_seconds_per_hour` | `integer`| `3600`       | Multiplier used to convert the selected hours into the value sent to the service (e.g. keep `3600` to send seconds, or use `60` for minutes). |

Example, matching Gardena's `start_override` service which expects a `duration` in seconds as a string:

```yaml
type: custom:lawn-mower-card
entity: lawn_mower.sileno_lawn_mower
override:
  name: Start override
  service: gardena_smart_system.start_override
  durations: [1, 2, 3, 6]
```

## Theming

This card can be styled by changing the values of these CSS properties (globally or per-card via [`card-mod`][card-mod]):

| Variable                    | Default value                                                          | Description                                         |
| --------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------- |
| `--vc-background`           | `var(--ha-card-background, var(--card-background-color, transparent))` | Card background.                                    |
| `--vc-primary-text-color`   | `var(--primary-text-color)`                                            | Mower name, stats values, etc.                      |
| `--vc-secondary-text-color` | `var(--secondary-text-color)`                                          | Status, stats units and titles, etc.                |
| `--vc-icon-color`           | `var(--secondary-text-color)`                                          | Colors of icons.                                    |
| `--vc-toolbar-background`   | `transparent`                                                          | Toolbar background (transparent to avoid stacking). |
| `--vc-toolbar-text-color`   | `var(--secondary-text-color)`                                          | Color of the toolbar texts.                         |
| `--vc-toolbar-icon-color`   | `var(--secondary-text-color)`                                          | Color of the toolbar icons.                         |
| `--vc-divider-color`        | `var(--entities-divider-color, var(--divider-color))`                  | Color of dividers.                                  |
| `--vc-spacing`              | `10px`                                                                 | Paddings and margins inside the card.               |

### Styling via theme

Here is an example of customization via theme. Read more in the [Frontend documentation](https://www.home-assistant.io/integrations/frontend/).

```yaml
my-custom-theme:
  vc-background: '#17A8F4'
  vc-spacing: 5px
```

### Styling via card-mod

You can use [`card-mod`][card-mod] to customize the card on per-card basis, like this:

```yaml
type: 'custom:lawn-mower-card'
style: |
  ha-card {
    --vc-background: #17A8F4;
    --vc-spacing: 5px;
  }
  ...
```

## Animations

I've added some animations for this card to make it alive. Animations are applied only for the `image` property. Here's how they look like:

|              Mowing               |                Returning to dock                |
| :--------------------------------: | :----------------------------------------------: |
| ![Mowing animation][cleaning-gif] | ![Returning animation][returning-gif] |

## Supported languages

This card supports translations. Please, help to add more translations and improve existing ones. Here's a list of supported languages:

- English
- Українська (Ukrainian)
- Deutsch (German)
- Français (French)
- Italiano (Italian)
- Nederlands (Dutch)
- Polski (Polish)
- Русский (Russian)
- Español (Spanish)
- Čeština (Czech)
- Magyar (Hungarian)
- עִבְרִית (Hebrew)
- Português (Portuguese)
- Português Brasileiro (Brazilian Portuguese)
- Svenska (Swedish)
- Norsk bokmål (Norwegian)
- Norsk nynorsk (Norwegian)
- Dansk (Danish)
- 한국어 (Korean)
- Suomi (Finnish)
- Català (Catalan)
- 正體中文 (Traditional Chinese)
- Việt Nam (Vietnamese)
- Lietuvių (Lithuanian)
- Română (Romanian)
- 简体中文 (Simplified Chinese)
- 日本語 (Japanese)
- [_Your language?_][add-translation]

## Supported models

This card relies on the standard `lawn_mower` services, like `start_mowing`, `pause` and `dock`. It should work with any integration that exposes a `lawn_mower` entity, e.g.:

- **Husqvarna** Automower (via the official Husqvarna Automower integration)
- **Worx** Landroid (via the Worx Landroid / WorxCloud integration)
- **Segway Navimow** (via the NavimowHA custom integration)
- **Mammotion** Luba / Yuka (via the Mammotion custom integration)
- **MQTT**-based lawn mowers (via the MQTT lawn mower integration)
- Any other integration that provides a `lawn_mower` entity

If this card works with your lawn mower, please open a PR and add your model to the list.

- [_Your mower?_][edit-readme]

## Development

Want to contribute to the project?

First of all, thanks! Check [contributing guideline](./CONTRIBUTING.md) for more information.

## Inspiration

This project is heavily inspired by:

- [denysdovhan/vacuum-card][vacuum-card] — this lawn mower card started its life as a fork/adaptation of the excellent vacuum card for Home Assistant.
- [MacBury Smart House][macbury-smart-house] — basically, the original vacuum card project is a refinement of MacBury's custom card.
- [Benji][bbbenji-card] vacuum card — where the original card design was first noticed, [first time](https://github.com/bbbenji/synthwave-hass/issues/29).

Huge thanks for their ideas and efforts 👍

## License

MIT © [Denys Dovhan][denysdovhan]

<!-- Badges -->

[npm-url]: https://npmjs.org/package/lawn-mower-card
[npm-image]: https://img.shields.io/npm/v/lawn-mower-card.svg?style=flat-square
[hacs-url]: https://github.com/hacs/integration
[hacs-image]: https://img.shields.io/badge/hacs-default-orange.svg?style=flat-square
[gh-sponsors-url]: https://github.com/sponsors/denysdovhan
[gh-sponsors-image]: https://img.shields.io/github/sponsors/denysdovhan?style=flat-square
[patreon-url]: https://patreon.com/denysdovhan
[patreon-image]: https://img.shields.io/badge/support-patreon-F96854.svg?style=flat-square
[buymeacoffee-url]: https://patreon.com/denysdovhan
[buymeacoffee-image]: https://img.shields.io/badge/support-buymeacoffee-222222.svg?style=flat-square
[twitter-url]: https://x.com/denysdovhan
[twitter-image]: https://img.shields.io/badge/follow-%40denysdovhan-000000.svg?style=flat-square

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[hacs]: https://hacs.xyz
[preview-image]: https://github.com/denysdovhan/vacuum-card/assets/3459374/43808d3d-65a4-4e65-9531-4f248fa8861c
[cleaning-gif]: https://user-images.githubusercontent.com/3459374/81119202-fa60b500-8f32-11ea-9b23-325efa93d7ab.gif
[returning-gif]: https://user-images.githubusercontent.com/3459374/81119452-765afd00-8f33-11ea-9dc5-9c26ba3f8c45.gif
[latest-release]: https://github.com/bertel2020/mower-card/releases/latest
[ha-scripts]: https://www.home-assistant.io/docs/scripts/
[edit-readme]: https://github.com/bertel2020/mower-card/edit/main/README.md
[card-mod]: https://github.com/thomasloven/lovelace-card-mod
[add-translation]: https://github.com/bertel2020/mower-card/blob/master/CONTRIBUTING.md#how-to-add-translation
[vacuum-card]: https://github.com/denysdovhan/vacuum-card
[macbury-smart-house]: https://macbury.github.io/SmartHouse/HomeAssistant/Vacuum/
[bbbenji-card]: https://gist.github.com/bbbenji/24372e423f8669b2e6713638d8f8ceb2
[denysdovhan]: https://denysdovhan.com
