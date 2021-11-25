import React from 'react';
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';

/**
 * A basic vertical non-linear implementation
 */
class VerticalNonLinear extends React.Component {

  state = {
    stepIndex: 0,
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    if (stepIndex < 2) {
      this.setState({stepIndex: stepIndex + 1});
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  renderStepActions(step) {
    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onClick={this.handleNext}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disableTouchRipple={true}
            disableFocusRipple={true}
            onClick={this.handlePrev}
          />
        )}
      </div>
    );
  }

  render() {
    const {stepIndex} = this.state;

    return (
      <div style={{maxWidth:600, width:'50%', margin: '0 auto'}}>
        <Stepper
          activeStep={stepIndex}
          linear={false}
          orientation="vertical"
        >
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 0})}>
              <h5>Create or Join a team</h5>
              <Avatar style={{margin:'8px'}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzdE_QfzTyoNlzR62peKfV82EbZJ9VeJxdng&usqp=CAU" />
            </StepButton>
            <StepContent>
              <p>
                You can create your own team or join a team using
                a joining code.
                <span style={{color:'red'}}> We suggest you to visit Slack Notifications section below before creating a team</span>
              </p>
              <img src="https://i.ytimg.com/vi/YLOjtyBdVlU/maxresdefault.jpg" style={{width:'460px',height:'190px',borderRadius:'10px'}}></img>
              {this.renderStepActions(0)}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 1})}>
              <h5>Create and Update Schedules</h5>
              <Avatar style={{margin:'8px'}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_3693KLpRD8Od3N-EJHid8UEVvWgh9Z-4g&usqp=CAU" />
            </StepButton>
            <StepContent>
              <p>Admins of a team can create schedules for that team.
                Schedules can be viewed by every member of the team but
                can be updated, deleted by admins only.
              </p>
              <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_Ldf0ECBdu2CGLnkS0eTc87LJpH7JH3134Q&usqp=CAU' style={{width:'460px',height:'190px',borderRadius:'10px'}}></img> 
              {this.renderStepActions(1)}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 2})}>
              <h5>Get Notified on Slack</h5>
              <Avatar style={{margin:'8px'}} src="data:image/jpeg;base64,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" />
            </StepButton>
            <StepContent>
              <p>
                Team members will be notified of the schedules of that team on Slack.
                <span>For getting started with Slack, please visit <a href='https://github.com/codersinghal/MS-Engage-2021' target="_blank">here</a></span>
              </p>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiM1N0ckWNIxaXbQGD8fxr7tdFR31IV9DDvg&usqp=CAU" style={{width:'460px',height:'190px',borderRadius:'10px'}}></img>
              {this.renderStepActions(2)}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}

export default VerticalNonLinear;