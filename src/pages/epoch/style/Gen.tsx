import * as React from 'react';
import * as utils from '../../../utils';

class GenEpochStyle extends React.Component<any, any> {

    componentDidMount() {

    }

    init = async () => {
        const gene = this.props.match.params.gene;
        const isDark = utils.isDark(gene);
        const style = utils.calcStyle(gene);
        const star = utils.calcDark(gene)


    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default GenEpochStyle;