<?php
/**
 * API class.
 * 
 * @package Codeinwp/QuickWP
 */

namespace ThemeIsle\QuickWP;

/**
 * API class.
 */
class API {
	/**
	 * API namespace.
	 *
	 * @var string
	 */
	private $namespace = 'quickwp';

	/**
	 * API version.
	 *
	 * @var string
	 */
	private $version = 'v1';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->register_route();
	}

	/**
	 * Get endpoint.
	 * 
	 * @return string
	 */
	public function get_endpoint() {
		return $this->namespace . '/' . $this->version;
	}

	/**
	 * Register hooks and actions.
	 * 
	 * @return void
	 */
	private function register_route() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST API route
	 * 
	 * @return void
	 */
	public function register_routes() {
		$namespace = $this->namespace . '/' . $this->version;

		$routes = array(
			'send'   => array(
				'methods'  => \WP_REST_Server::CREATABLE,
				'args'     => array(
					'step'    => array(
						'required' => true,
						'type'     => 'string',
					),
					'message' => array(
						'required' => false,
						'type'     => 'string',
					),
				),
				'callback' => array( $this, 'send' ),
			),
			'status' => array(
				'methods'  => \WP_REST_Server::READABLE,
				'args'     => array(
					'thread_id' => array(
						'required' => true,
						'type'     => 'string',
					),
					'run_id'    => array(
						'required' => true,
						'type'     => 'string',
					),
				),
				'callback' => array( $this, 'status' ),
			),
			'get'    => array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get' ),
			),
			'images' => array(
				'methods'  => \WP_REST_Server::READABLE,
				'args'     => array(
					'query' => array(
						'required' => true,
						'type'     => 'string',
					),
				),
				'callback' => array( $this, 'images' ),
			),
		);

		foreach ( $routes as $route => $args ) {
			$args['permission_callback'] = function () {
				return current_user_can( 'manage_options' );
			};

			register_rest_route( $namespace, '/' . $route, $args );
		}
	}

	/**
	 * Send data to the API.
	 * 
	 * @param \WP_REST_Request $request Request.
	 * 
	 * @return \WP_REST_Response
	 */
	public function send( \WP_REST_Request $request ) {
		$data = $request->get_params();

		$request = wp_remote_post(
			QUICKWP_API . 'wizard/send',
			array(
				'body' => array(
					'step'    => $data['step'],
					'message' => $data['message'],
				),
			)
		);

		if ( is_wp_error( $request ) ) {
			return new \WP_REST_Response( array( 'error' => $request->get_error_message() ), 500 );
		}

		/** 
		 * Holds the response as a standard class object
		 *
		 * @var \stdClass $response 
		 */
		$response = json_decode( wp_remote_retrieve_body( $request ) );

		if ( ! isset( $response->id ) || ! $response->id ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		return new \WP_REST_Response( $response, 200 );
	}

	/**
	 * Get status.
	 * 
	 * @param \WP_REST_Request $request Request.
	 * 
	 * @return \WP_REST_Response
	 */
	public function status( \WP_REST_Request $request ) {
		$data = $request->get_params();

		$request = wp_remote_get( // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.wp_remote_get_wp_remote_get
			QUICKWP_API . 'wizard/status',
			array(
				'body' => array(
					'thread_id' => $data['thread_id'],
					'run_id'    => $data['run_id'],
				),
			)
		);

		if ( is_wp_error( $request ) ) {
			return new \WP_REST_Response( array( 'error' => $request->get_error_message() ), 500 );
		}

		/** 
		 * Holds the response as a standard class object
		 *
		 * @var \stdClass $response 
		 */
		$response = json_decode( wp_remote_retrieve_body( $request ) );

		if ( ! isset( $response->id ) || ! $response->id ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		return new \WP_REST_Response( $response, 200 );
	}

	/**
	 * Get data.
	 * 
	 * @param \WP_REST_Request $request Request.
	 * 
	 * @return \WP_REST_Response
	 */
	public function get( \WP_REST_Request $request ) {
		$data = $request->get_params();

		$request = wp_remote_get(// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.wp_remote_get_wp_remote_get
			QUICKWP_API . 'wizard/get',
			array(
				'body' => array(
					'thread_id' => $data['thread_id'],
				),
			)
		);

		if ( is_wp_error( $request ) ) {
			return new \WP_REST_Response( array( 'error' => $request->get_error_message() ), 500 );
		}

		/** 
		 * Holds the response as a standard class object
		 *
		 * @var \stdClass $response 
		 */
		$response = json_decode( wp_remote_retrieve_body( $request ) );

		if ( ! isset( $response->data ) || ! $response->data ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		return new \WP_REST_Response( $response, 200 );
	}

	/**
	 * Get images.
	 * 
	 * @param \WP_REST_Request $request Request.
	 * 
	 * @return \WP_REST_Response
	 */
	public function images( \WP_REST_Request $request ) {
		$data = $request->get_params();

		$request = wp_remote_get(// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.wp_remote_get_wp_remote_get
			QUICKWP_API . 'wizard/images',
			array(
				'body' => array(
					'query' => $data['query'],
				),
			)
		);

		if ( is_wp_error( $request ) ) {
			return new \WP_REST_Response( array( 'error' => $request->get_error_message() ), 500 );
		}

		/** 
		 * Holds the response as a standard class object
		 *
		 * @var \stdClass $response 
		 */
		$response = json_decode( wp_remote_retrieve_body( $request ) );

		if ( ! isset( $response->photos ) || count( $response->photos ) === 0 ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		return new \WP_REST_Response( $response, 200 );
	}
}
