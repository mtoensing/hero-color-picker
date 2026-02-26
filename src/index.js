import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { ColorPicker, PanelRow } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

const META_KEY = 'hero_color_picker_hero_color';

function HeroColorPickerPanel() {
	const meta = useSelect(
		(select) => select('core/editor').getEditedPostAttribute('meta') || {},
		[]
	);

	const { editPost } = useDispatch('core/editor');

	const value = meta[META_KEY] || '';

	return (
		<PluginDocumentSettingPanel
			name="hero-color-picker"
			title="Hero Color Picker"
			className="hero-color"
		>
			<PanelRow>
				<div style={{ width: '100%' }}>
					<div style={{ marginBottom: 8 }}>{ __( 'Hero Color Picker', 'hero-color-picker' ) }</div>

					<ColorPicker
						color={value || '#111111'}
						enableAlpha={false}
						onChange={(newColor) => {
							editPost({ meta: { ...meta, [META_KEY]: newColor } });
						}}
					/>

					<div style={{ marginTop: 8, fontFamily: 'monospace' }}>
						{value ||  __( 'No color selected', 'hero-color-picker' ) }
					</div>
				</div>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin('hero-color-picker', { render: HeroColorPickerPanel });
