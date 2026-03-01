import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { Button, ColorPicker, Dropdown, PanelRow } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

const BACKGROUND_META_KEY = 'hero_color_picker_hero_color';
const FONT_META_KEY = 'hero_color_picker_font_color';
const AAA_NORMAL_TEXT_MIN_CONTRAST = 7;

function hexToRgb( hexColor ) {
	if ( typeof hexColor !== 'string' ) {
		return null;
	}

	const rawHex = hexColor.trim().replace( '#', '' );
	const expandedHex =
		rawHex.length === 3
			? rawHex
					.split( '' )
					.map( ( char ) => char + char )
					.join( '' )
			: rawHex;

	if ( ! /^[0-9a-fA-F]{6}$/.test( expandedHex ) ) {
		return null;
	}

	return {
		r: parseInt( expandedHex.slice( 0, 2 ), 16 ),
		g: parseInt( expandedHex.slice( 2, 4 ), 16 ),
		b: parseInt( expandedHex.slice( 4, 6 ), 16 ),
	};
}

function channelToLinear( channel ) {
	const srgb = channel / 255;

	return srgb <= 0.03928 ? srgb / 12.92 : ( ( srgb + 0.055 ) / 1.055 ) ** 2.4;
}

function getRelativeLuminance( color ) {
	return (
		0.2126 * channelToLinear( color.r ) +
		0.7152 * channelToLinear( color.g ) +
		0.0722 * channelToLinear( color.b )
	);
}

function getContrastRatio( foregroundHex, backgroundHex ) {
	const foregroundColor = hexToRgb( foregroundHex );
	const backgroundColor = hexToRgb( backgroundHex );

	if ( ! foregroundColor || ! backgroundColor ) {
		return null;
	}

	const foregroundLuminance = getRelativeLuminance( foregroundColor );
	const backgroundLuminance = getRelativeLuminance( backgroundColor );
	const lighter = Math.max( foregroundLuminance, backgroundLuminance );
	const darker = Math.min( foregroundLuminance, backgroundLuminance );

	return ( lighter + 0.05 ) / ( darker + 0.05 );
}

function OnDemandColorControl( {
	label,
	value,
	onChange,
	onReset,
	resetText,
} ) {
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
							<span>
								{ value ||
									__( 'Select color', 'hero-color-picker' ) }
							</span>
							<span
								aria-hidden
								style={ {
									display: 'inline-block',
									marginLeft: 8,
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
	const contrastRatio = getContrastRatio( fontValue, backgroundValue );
	const aaaPass =
		contrastRatio !== null && contrastRatio >= AAA_NORMAL_TEXT_MIN_CONTRAST;

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
								meta: {
									...meta,
									[ BACKGROUND_META_KEY ]: newColor,
								},
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
							editPost( {
								meta: { ...meta, [ FONT_META_KEY ]: '' },
							} );
						} }
						resetText={ __( 'Unset', 'hero-color-picker' ) }
					/>

					<div
						style={ {
							marginTop: 8,
							paddingTop: 8,
							borderTop: '1px solid #ddd',
						} }
					>
						<div style={ { marginBottom: 4 } }>
							{ __(
								'WCAG AAA Normal Text Contrast Ratio',
								'hero-color-picker'
							) }
						</div>
						<div
							style={ {
								fontWeight: 600,
								color: aaaPass ? '#0a7d23' : '#b32d2e',
							} }
						>
							{ aaaPass
								? __( 'PASS', 'hero-color-picker' )
								: __( 'FAILED', 'hero-color-picker' ) }
						</div>

						<div
							style={ {
								marginTop: 10,
								padding: 10,
								borderRadius: 4,
								border: '1px solid #dcdcde',
								backgroundColor: backgroundValue || '#f0f0f1',
								color: fontValue || '#1e1e1e',
							} }
						>
							<div style={ { fontWeight: 600, marginBottom: 4 } }>
								{ __( 'Preview', 'hero-color-picker' ) }
							</div>
							<div>
								{ __(
									'This is how background and font color look together.',
									'hero-color-picker'
								) }
							</div>
						</div>
					</div>
				</div>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin( 'hero-color-picker', { render: HeroColorPickerPanel } );
