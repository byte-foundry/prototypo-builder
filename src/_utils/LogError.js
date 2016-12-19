export default function( error, logger ) {
  if ( error instanceof Error && ( logger || typeof console !== undefined ) ) {
    /* eslint-disable no-console */
    ( logger || console.error )( error );
    /* eslint-enable no-console */
  }

  return error;
}
