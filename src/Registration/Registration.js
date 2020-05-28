import React from 'react';


class Registration extends React.Component {

  sendRequest(method, url, body = null) {
    return fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.then(error => {
          const e = new Error('Что-то пошло не так')
          e.data = error;
          throw e;
        })
      }
    })
  }

  sendForm = () => {
    let body = {
      firstName: document.querySelector('#firstName').value,
      lastName: document.querySelector('#lastName').value,
      email: document.querySelector('#email').value,
      password: document.querySelector('#getPassword').value
    }
    this.sendRequest('POST', 'http://api.laptop-shop.by/registrate.php', body)
      .then(response => {
        switch (response) {
          case 'success':
            document.querySelector('#resultRegistrate').textContent = 'Ваша учетная запись создана';
            setTimeout(()=>{document.location.href='/'},1000);
            break;
          case 'this email exist':
            document.querySelector('#resultRegistrate').textContent = 'Такой адрес электронной почты уже зарегистрирован';
            break;
          default:
            document.querySelector('#resultRegistrate').textContent = 'Ошибка сервера, попробуйте позже';
            break;
        }

      })

  }

  checkTermOfUse = () => {
    document.querySelector("#registration-btn").toggleAttribute("disabled");
  }



  render() {
    return (
      <div className="registration">
        <div className="container">
          <div className="py-5 text-center">
            <h2>Форма регистрации</h2>
            <p className="lead">Здесь вы можете ввести ваши данные, которые будут использованы нами</p>
          </div>

          <div className="row">

            <div className="col-md-8 order-md-1">
              <h4 className="mb-3">Введите учетные данные</h4>
              <form className="needs-validation" noValidate="" id="registrate-form" onSubmit={event => { event.preventDefault(); this.sendForm(); }}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName">Имя</label>
                    <input type="text" className="form-control" id="firstName" placeholder="" defaultValue="" required={true} />
                    <div className="invalid-feedback">
                      Valid first name is required.
                </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName">Фамилия</label>
                    <input type="text" className="form-control" id="lastName" placeholder="" defaultValue="" required={true} />
                    <div className="invalid-feedback">
                      Valid last name is required.
                </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email">Email</label>
                  <input type="email" className="form-control" id="email" placeholder="you@example.com" required={true} />
                  <div className="invalid-feedback">
                    Please enter a valid email address for shipping updates.
              </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="get-password">Пароль</label>
                  <input type="password" className="form-control" id="getPassword" placeholder="" required={true} />
                  <div className="invalid-feedback">
                    Please enter your shipping address.
              </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirm-password">Подтверждение пароля</label>
                  <input type="password" className="form-control" id="confirmPassword" placeholder="" required={true} />
                </div>

                <button type="button" className="btn btn-ligh" data-toggle="modal" data-target="#exampleModalScrollable">Правила использования</button>

                <div className="modal fade" id="exampleModalScrollable" tabIndex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalScrollableTitle">Правила использования</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quia voluptatum eum architecto similique animi saepe quasi ullam placeat.
                        Quidem odit aspernatur ratione deserunt, nulla sunt quis sapiente reprehenderit aut, id magnam quam tempore est, praesentium dolore ipsa impedit
                        amet modi numquam. Id aliquam consectetur saepe aut. Sequi facilis delectus vitae, ullam rem enim laudantium nihil quaerat nesciunt distinctio beatae!
                        Animi impedit, aspernatur cumque placeat modi illum nam tempore error, earum dolorem, labore consectetur quibusdam officiis blanditiis quisquam! Possimus
                        repellendus, autem ullam aspernatur molestias ea nulla eaque dolores debitis laboriosam non totam aliquid? Vitae at ullam nihil voluptates laborum non
                        perferendis magnam magni necessitatibus! Eius placeat temporibus sequi alias similique quidem aliquid, unde eum distinctio commodi dolores nihil necessitatibus
                        maiores quisquam molestias id aut reiciendis minus. Nihil optio obcaecati facilis perferendis vero atque suscipit dolore amet. Facilis reiciendis voluptatum
                        delectus minima tempore dicta molestiae alias iure excepturi fugiat corporis tempora atque error recusandae ipsa, accusamus inventore quaerat deserunt quia qui
                        sunt ut autem. Sint unde recusandae explicabo esse pariatur, libero laborum quis ut corrupti debitis corporis minima odio maxime ipsum nostrum ratione beatae
                        qui error quod nam dicta ipsam veniam voluptate. At sunt, officiis vitae, officia nam nesciunt dolorum aperiam consequuntur quasi, minus ullam. Adipisci rerum at
                        dolor officiis nesciunt dicta voluptas veniam non pariatur, architecto incidunt esse dignissimos libero, fugit quia ab accusamus quod, autem ut reiciendis consequuntur
                        reprehenderit a? Earum error nisi officiis animi? Animi fuga officiis, omnis eligendi, eius repellendus odit sequi est repellat ut accusamus reiciendis inventore
                        assumenda similique voluptate beatae incidunt, dolore aliquam corrupti aliquid! Distinctio magni, veniam tenetur ab recusandae omnis libero. Nihil asperiores
                        beatae et eum nam praesentium illum. Iste animi minima voluptate omnis quas, repellat dignissimos
                        voluptatum eos sequi nam molestias magnam enim saepe provident assumenda officiis repellendus similique eligendi corrupti soluta?
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="mb-4" />
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id="save-info" onChange={this.checkTermOfUse} />
                  <label className="custom-control-label" htmlFor="save-info">Я прочитал и согласен с правилами использования ресурса</label>
                </div>
                <hr className="mb-4" />
                <p id="resultRegistrate"></p>
                <hr className="mb-4" />
                <button className="btn btn-primary btn-lg btn-block mb-5" type="submit" id="registration-btn" disabled>Зарегистрироваться</button>
              </form>
            </div>
          </div>
        </div>

      </div>




    );
  }
}



export default Registration;