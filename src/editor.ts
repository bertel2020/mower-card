import { LitElement, html, nothing } from 'lit';
import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardEditor,
  fireEvent,
} from 'custom-card-helpers';
import localize from './localize';
import { customElement, property, state } from 'lit/decorators.js';
import { Template, LawnMowerCardConfig } from './types';
import styles from './editor.css';

type ConfigElement = HTMLInputElement & {
  configValue?: keyof LawnMowerCardConfig;
};

@customElement('lawn-mower-card-editor')
export class LawnMowerCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config!: Partial<LawnMowerCardConfig>;

  @state() private image? = undefined;
  @state() private compact_view = false;
  @state() private show_name = true;
  @state() private show_status = true;
  @state() private status_attribute? = '';
  @state() private show_toolbar = true;

  setConfig(config: LovelaceCardConfig & LawnMowerCardConfig): void {
    this.config = config;

    if (!this.config.entity) {
      this.config.entity = this.getEntitiesByType('lawn_mower')[0] || '';
      fireEvent(this, 'config-changed', { config: this.config });
    }
  }

  private getEntitiesByType(type: string): string[] {
    if (!this.hass) {
      return [];
    }
    return Object.keys(this.hass.states).filter((id) => id.startsWith(type));
  }

  private getEntityAttributes(entityId?: string): string[] {
    if (!this.hass || !entityId || !this.hass.states[entityId]) {
      return [];
    }
    return Object.keys(this.hass.states[entityId].attributes);
  }

  protected render(): Template {
    if (!this.hass) {
      return nothing;
    }

    const mowerEntities = this.getEntitiesByType('lawn_mower');
    const batteryEntities = this.getEntitiesByType('sensor');
    const cameraEntities = [
      ...this.getEntitiesByType('camera'),
      ...this.getEntitiesByType('image'),
    ];
    const statusAttributes = this.getEntityAttributes(this.config.entity);

    return html`
      <div class="card-config">
        <div class="option">
          <ha-select
            .label=${localize('editor.entity')}
            @selected=${this.valueChanged}
            .configValue=${'entity'}
            .value=${this.config.entity}
            @closed=${(e: Event) => e.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth
            required
            validationMessage=${localize('error.missing_entity')}
          >
            ${mowerEntities.map(
              (entity) =>
                html` <mwc-list-item .value=${entity}
                  >${entity}</mwc-list-item
                >`,
            )}
          </ha-select>
        </div>

        <div class="option">
          <ha-select
            .label=${localize('editor.battery_entity')}
            @selected=${this.valueChanged}
            .configValue=${'battery_entity'}
            .value=${this.config.battery_entity}
            @closed=${(e: Event) => e.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth
          >
            ${batteryEntities.map(
              (entity) =>
                html` <mwc-list-item .value=${entity}
                  >${entity}</mwc-list-item
                >`,
            )}
          </ha-select>
        </div>

        <div class="option">
          <ha-select
            .label=${localize('editor.map')}
            @selected=${this.valueChanged}
            .configValue=${'map'}
            .value=${this.config.map}
            @closed=${(e: Event) => e.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth
          >
            ${cameraEntities.map(
              (entity) =>
                html` <mwc-list-item .value=${entity}
                  >${entity}</mwc-list-item
                >`,
            )}
          </ha-select>
        </div>

        <div class="option">
          <paper-input
            label="${localize('editor.image')}"
            .value=${this.image}
            .configValue=${'image'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(
              this.compact_view
                ? 'editor.compact_view_aria_label_off'
                : 'editor.compact_view_aria_label_on',
            )}
            .checked=${Boolean(this.compact_view)}
            .configValue=${'compact_view'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.compact_view')}
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(
              this.show_name
                ? 'editor.show_name_aria_label_off'
                : 'editor.show_name_aria_label_on',
            )}
            .checked=${Boolean(this.show_name)}
            .configValue=${'show_name'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_name')}
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(
              this.show_status
                ? 'editor.show_status_aria_label_off'
                : 'editor.show_status_aria_label_on',
            )}
            .checked=${Boolean(this.show_status)}
            .configValue=${'show_status'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_status')}
        </div>

        <div class="option">
          <ha-select
            .label=${localize('editor.status_attribute')}
            @selected=${this.valueChanged}
            .configValue=${'status_attribute'}
            .value=${this.config.status_attribute}
            @closed=${(e: Event) => e.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth
          >
            <mwc-list-item .value=${''}
              >${localize('editor.status_attribute_default')}</mwc-list-item
            >
            ${statusAttributes.map(
              (attribute) =>
                html` <mwc-list-item .value=${attribute}
                  >${attribute}</mwc-list-item
                >`,
            )}
          </ha-select>
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(
              this.show_toolbar
                ? 'editor.show_toolbar_aria_label_off'
                : 'editor.show_toolbar_aria_label_on',
            )}
            .checked=${Boolean(this.show_toolbar)}
            .configValue=${'show_toolbar'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_toolbar')}
        </div>

        <strong>${localize('editor.code_only_note')}</strong>
      </div>
    `;
  }

  private valueChanged(event: Event): void {
    if (!this.config || !this.hass || !event.target) {
      return;
    }
    const target = event.target as ConfigElement;
    if (
      !target.configValue ||
      this.config[target.configValue] === target?.value
    ) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        delete this.config[target.configValue];
      } else {
        this.config = {
          ...this.config,
          [target.configValue]:
            target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this.config });
  }

  static get styles() {
    return styles;
  }
}
