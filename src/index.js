import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { Button, ColorPicker, Dropdown, PanelRow } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

const BACKGROUND_META_KEY = 'hero_color_picker_hero_color';
const FONT_META_KEY = 'hero_color_picker_font_color';

function OnDemandColorControl( { label, value, onChange, onReset, resetText } ) {
	return (
		<div style={ { marginBottom: 16 } }>
			<div style={ { marginBottom: 8 } }>{ label }</div>
			<div style={ { display: 'flex', gap: 8, alignItems: 'center' } }>
				<Dropdown
					popoverProps={ {
						placement: 'left-start',
					} }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							variant="secondary"
							onClick={ onToggle }
							aria-expanded={ isOpen }
							style={ {
								flex: 1,
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							} }
						>
							<span>{ value || __( 'Select color', 'hero-color-picker' ) }</span>
							<span
								aria-hidden
								style={ {
									display: 'inline-block',
									width: 14,
									height: 14,
									borderRadius: 2,
									border: '1px solid #ccc',
									backgroundColor: value || 'transparent',
								} }
							/>
						</Button>
					) }
					renderContent={ () => (
						<div style={ { padding: 8 } }>
							<ColorPicker
								color={ value || '#111111' }
								enableAlpha={ false }
								onChange={ onChange }
							/>
						</div>
					) }
				/>
				<Button
					variant="secondary"
					isDestructive
					onClick={ onReset }
					disabled={ ! value }
				>
					{ resetText }
				</Button>
			</div>
		</div>
	);
}

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
					<OnDemandColorControl
						label={ __( 'Background Color', 'hero-color-picker' ) }
						value={ backgroundValue }
						onChange={ ( newColor ) => {
							editPost( {
								meta: { ...meta, [ BACKGROUND_META_KEY ]: newColor },
							} );
						} }
						onReset={ () => {
							editPost( {
								meta: { ...meta, [ BACKGROUND_META_KEY ]: '' },
							} );
						} }
						resetText={ __( 'Unset', 'hero-color-picker' ) }
					/>

					<OnDemandColorControl
						label={ __( 'Font Color', 'hero-color-picker' ) }
						value={ fontValue }
						onChange={ ( newColor ) => {
							editPost( {
								meta: { ...meta, [ FONT_META_KEY ]: newColor },
							} );
						} }
						onReset={ () => {
							editPost( { meta: { ...meta, [ FONT_META_KEY ]: '' } } );
						} }
						resetText={ __( 'Unset', 'hero-color-picker' ) }
					/>
				</div>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin( 'hero-color-picker', { render: HeroColorPickerPanel } );
