// Styles for signup/login/resetpassword page
const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      width: '400px',
      margin: '0 auto',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    tab: {
      flex: 1,
      textAlign: 'center' as 'center',
      listStyle: 'none',
      padding: '10px',
      cursor: 'pointer',
      borderBottom: '3px solid transparent',
    },
    activeTab: {
      borderBottom: '3px solid #6200EE',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: '10px',
    },
    inputContainer: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      textAlign: 'left' as 'left',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginBottom: '10px',
    },
    button: {
      padding: '10px',
      background: '#6200EE',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    error: {
      color: 'red',
    },
  };

  export default styles;