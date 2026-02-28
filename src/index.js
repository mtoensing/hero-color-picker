import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { Button, ColorPicker, PanelRow } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

const META_KEY = 'hero_color_picker_hero_color';

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

	const value = meta[ META_KEY ] || '';

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
						color={ value || '#111111' }
						enableAlpha={ false }
						onChange={ ( newColor ) => {
							editPost( {
								meta: { ...meta, [ META_KEY ]: newColor },
							} );
						} }
					/>

					<Button
						variant="secondary"
						isDestructive
						onClick={ () => {
							editPost( { meta: { ...meta, [ META_KEY ]: '' } } );
						} }
						disabled={ ! value }
						style={ { marginTop: 8, marginLeft: 16 } }
					>
						{ __( 'Unset color', 'hero-color-picker' ) }
					</Button>
				</div>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin( 'hero-color-picker', { render: HeroColorPickerPanel } );
