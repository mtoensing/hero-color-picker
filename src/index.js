import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { Button, ColorPicker, PanelRow } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

const BACKGROUND_META_KEY = 'hero_color_picker_hero_color';
const FONT_META_KEY = 'hero_color_picker_font_color';

function HeroColorPickerPanel() {
	const { meta, postType } = useSelect( ( select ) => {
		const editor = select( 'core/editor' );

		return {
			meta: editor.getEditedPostAttribute( 'meta' ) || {},
			postType: editor.getCurrentPostType(),
		};
	}, [] );

	const { editPost } = useDispatch( 'core/editor' );

	if ( postType !== 'post' ) {
		return null;
	}

	const backgroundValue = meta[ BACKGROUND_META_KEY ] || '';
	const fontValue = meta[ FONT_META_KEY ] || '';

	return (
		<PluginDocumentSettingPanel
			name="hero-color-picker"
			title="Hero Color Picker"
			className="hero-color"
		>
			<PanelRow>
				<div style={ { width: '100%' } }>
					<div style={ { marginBottom: 8 } }>
						{ __( 'Background Color', 'hero-color-picker' ) }
					</div>
					<ColorPicker
						color={ backgroundValue || '#111111' }
						enableAlpha={ false }
						onChange={ ( newColor ) => {
							editPost( {
								meta: { ...meta, [ BACKGROUND_META_KEY ]: newColor },
							} );
						} }
					/>

					<Button
						variant="secondary"
						isDestructive
						onClick={ () => {
							editPost( {
								meta: { ...meta, [ BACKGROUND_META_KEY ]: '' },
							} );
						} }
						disabled={ ! backgroundValue }
						style={ { marginTop: 8, marginLeft: 16 } }
					>
						{ __( 'Unset background color', 'hero-color-picker' ) }
					</Button>

					<div style={ { marginTop: 16, marginBottom: 8 } }>
						{ __( 'Font Color', 'hero-color-picker' ) }
					</div>
					<ColorPicker
						color={ fontValue || '#111111' }
						enableAlpha={ false }
						onChange={ ( newColor ) => {
							editPost( {
								meta: { ...meta, [ FONT_META_KEY ]: newColor },
							} );
						} }
					/>

					<Button
						variant="secondary"
						isDestructive
						onClick={ () => {
							editPost( { meta: { ...meta, [ FONT_META_KEY ]: '' } } );
						} }
						disabled={ ! fontValue }
						style={ { marginTop: 8, marginLeft: 16 } }
					>
						{ __( 'Unset font color', 'hero-color-picker' ) }
					</Button>
				</div>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin( 'hero-color-picker', { render: HeroColorPickerPanel } );
