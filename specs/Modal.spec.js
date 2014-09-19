require('./helper');
var Modal = require('../lib/components/Modal');

describe('Modal', function () {
  it('throws without an appElement');
  it('uses the global appElement');
  it('accepts appElement as a prop');
  it('opens');
  it('closes');
  it('renders into the body, not in context');
  it('renders children');
  it('has default props');
  it('removes the portal node');
  it('scopes tab navigation to the modal');
  it('focuses the modal');
});

var Course = React.createClass({
  statics: {
    didTransitionTo: function(params, setProps) {
      getCourseIsomorphically(params.courseId, function(course) {
        setProps({course: course});
      });
    },

    shouldRenderWithProps: function(props) {
      return ENV.server ? !!props.course : true;
    }
  },

  render: function() {
    return <h1>{this.props.course.name}</h1>
  }
});

var Course = React.createClass({
  statics: (ENV.server ? {
    didTransitionTo: function(params, setProps) {
      getCourseFromDB(params.courseId, function(course) {
        setProps({course: course});
      });
    },

    shouldRenderWithProps: function(props) {
      return !!props.course;
    }
  } : null),

  getInitialState: function() {
    return {
      course: this.props.course
    };
  },

  componentDidMount: function() {
    CourseStore.addChangeListener(this.onStoreChange);
  },

  componentWillUnmount: function() {
    CourseStore.removeChangeListener(this.onStoreChange);
  },

  onStoreChange: function() {
    this.setState({
      course: CourseStore.getCourse(this.props.params.courseId)
    });
  },

  getStateFromStores: function() {
    var courseId = this.props.params.courseId;
    return {
      course: this.props.course || CourseStore.getCourse(courseId)
    };
  },

  render: function() {
    return <h1>{this.state.course.name}</h1>
  }
});

var Course = React.createClass({
  statics: {
    didTransitionTo: function(params, setProps) {
      if (ENV.server) {
        getCourseFromDB(params.courseId, function(course) {
          setProps({course: course});
        });
      }
      else {
        this.onStoreChange = this.onStoreChange.bind(params, setProps);
        CourseStore.addChangeListener(this.onStoreChange);
      }
    },

    onStoreChange: function(params, setProps) {
      setProps({course: CourseStore.getCourse(params.courseId)});
    },

    didTransitionFrom: function(params) {
      if (ENV.server) return;
      CourseStore.removeChangeListener(this.onStoreChange);
    },

    shouldRenderWithProps: function(props) {
      return ENV.server ? !!props.course : true;
    }
  },

  render: function() {
    return <h1>{this.props.course.name}</h1>
  }
});


