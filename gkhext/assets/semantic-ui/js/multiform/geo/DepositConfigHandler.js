export class DepositConfigHandler {
  constructor(props) {
    this.props = props;
    this.config = props.config || {};

    this.config["canHaveMetadataOnlyRecords"] = true;

    // check if files are present
    this.noFiles = false;
    if (
      !Array.isArray(this.props.files.entries) ||
      (!this.props.files.entries.length && this.props.record.is_published)
    ) {
      this.noFiles = true;
    }
  }

  accordionStyle = {
    header: {className: "inverted brand", style: {cursor: "pointer"}},
  };

};
